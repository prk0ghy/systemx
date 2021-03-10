import * as resources from "./resources.mjs";
import cache, { save as saveCache } from "./cache.mjs";
import {
	hash as contentTypeHash,
	render
} from "./content_types.mjs";
import { fill as fillMarkers } from "./content_types/marker.mjs";
import { formatHTML } from "./format.mjs";
import fs from "fs";
import { hash } from "./crypto.mjs";
import path from "path";
import query from "./cms.mjs";
import wrapWithApplicationShell from "./page.mjs";
export const resourceDirectoryName = "res";
const fsp = fs.promises;

async function mkdirp(...pathParts) {
	const joinedPath = path.join(...pathParts);
	try {
		await fs.mkdirSync(joinedPath, { recursive: true });
	}
	catch (error) {
		console.error("Directory creation has failed.", error);
	}
	return joinedPath;
}

function getTargetPath(targetName) {
	return path.join("web", targetName);
}

export function getResourcePath(targetName) {
	return path.join(getTargetPath(targetName), resourceDirectoryName);
}

async function copyDirectory(source, destination, targetName) {
	await mkdirp(destination);
	const fileNames = await fsp.readdir(source);
	const promises = [];
	for (const fileName of fileNames) {
		try {
			const sourcePath = path.join(source, fileName);
			const targetPath = path.join(destination, fileName);
			const stat = await fsp.stat(sourcePath);
			if (stat.isFile()) {
				if (path.extname(sourcePath) === ".html") {
					promises.push(renderFile(sourcePath, targetPath, targetName));
				}
				else {
					promises.push(fsp.copyFile(sourcePath, targetPath));
				}
			}
			else if (stat.isDirectory()) {
				promises.push(copyDirectory(sourcePath, targetPath, targetName));
			} // Ignore everything else
		}
		catch {/* If we can't stat, then just skip */}
	}
	return Promise.all(promises);
}

async function copyAssets(destination) {
	const assetDirectories = await resources.getAssetDirectories();
	return Promise.all(assetDirectories.map(directory => copyDirectory(directory, destination)));
}

async function renderFile(source, destination, targetName) {
	const fileContent = await fsp.readFile(source, "utf-8");
	const html = await wrapWithApplicationShell(targetName, "Instrumentalisierung der Vergangenheit", fileContent);
	return fsp.writeFile(destination, html);
}

export const buildEntries = async targetName => {
	const result = await query(scope => `
		entries {
			${scope.entry}
			children {
				${scope.entry}
			}
		}
	`);
	const mustInvalidateCache = cache.contentTypeHash !== contentTypeHash;
	const targetPath = getTargetPath(targetName);
	await Promise.all(result.entries.map(async entry => {
		if (!mustInvalidateCache && cache.entryDateUpdated[entry.uid] === entry.dateUpdated) {
			/* Don't generate HTML, since the GraphQL response will be the same. */
			return;
		}
		cache.entryDateUpdated[entry.uid] = entry.dateUpdated;
		const html = await render(entry);
		const hashedHTML = hash(html);
		if (!mustInvalidateCache && cache.entryResultHashes[entry.uid] === hashedHTML) {
			/* Don't write the file, since the content will be the same. */
			return;
		}
		cache.entryResultHashes[entry.uid] = hashedHTML;
		const directory = await mkdirp(targetPath, entry.uri);
		const outputFilePath = path.join(directory, "index.html");
		const wrappedHTML = await wrapWithApplicationShell(targetName, entry.title, html);
		const finalHTML = fillMarkers(wrappedHTML);
		await fsp.writeFile(outputFilePath, formatHTML(finalHTML));
	}));
	if (mustInvalidateCache) {
		cache.contentTypeHash = contentTypeHash;
	}
};

export async function build(targetName) {
	const resourcePath = getResourcePath(targetName);
	mkdirp(resourcePath);
	await copyDirectory(path.join("tests", "instrumentalisierung"), getTargetPath(targetName), targetName);
	await copyAssets(resourcePath);
	console.time("target#buildEntries");
	await buildEntries(targetName);
	console.timeEnd("target#buildEntries");
	await saveCache();
}
