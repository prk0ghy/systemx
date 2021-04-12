import * as resources from "./page_elements/resources.mjs";
import { buildHead } from "./page_elements/head.mjs";
import { formatHTML } from "./format.mjs";
import fs from "fs";
import { loadNavigation } from "./page_elements/navigation.mjs";
import Marker from "./types/helper/Marker.mjs";
import options from "./options.mjs";
import path from "path";
import query from "./cms.mjs";
import { render } from "./renderer.mjs";
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
			} else if (stat.isDirectory()) {
				promises.push(copyDirectory(sourcePath, targetPath, targetName));
			} // Ignore everything else
		}
		catch { /* If we can't stat, then just skip */ }
	}
	return Promise.all(promises);
}

async function copyAssets(destination) {
	const assetDirectories = await resources.getAssetDirectories();
	return Promise.all(assetDirectories.map(directory => copyDirectory(directory, destination)));
}

async function renderFile(source, destination, targetName) {
	const targetPath = getTargetPath(targetName);
	const fileContent = await fsp.readFile(source, "utf-8");
	const html = await wrapWithApplicationShell(targetName, {
		content: fileContent,
		pageTitle: "Instrumentalisierung der Vergangenheit",
		pageType: "testpage",
		pageURL: destination.substr(targetPath.length).replace("\\","/")
	});
	return fsp.writeFile(destination, html);
}

export const buildEntries = async targetName => {
	const result = await query(types => `
		entries {
			${types.Entry}
		}
	`);
	const targetPath = getTargetPath(targetName);
	await Promise.all(result.entries.map(async entry => {
		const directory = await mkdirp(targetPath, entry.uri);
		const outputFilePath = path.join(directory, "index.html");
		try {
			const { mtime } = await fsp.stat(outputFilePath);
			if (Date.parse(mtime) > Date.parse(entry.dateUpdated)) {
				return;
			}
		}
		catch {
			/* Doesn't matter if it fails, we just render a new file */
		}
		const html = await render(entry);
		/* Remove target prefix and in case of Windows, replace blackslashes with forward slashes */
		const url = outputFilePath.substr(targetPath.length).replace(/\\/g,"/");
		const wrappedHTML = await wrapWithApplicationShell(targetName, {
			content: html,
			pageTitle: entry.title,
			pageType: entry.__typename === "inhalt_inhalt_Entry"
				? "content"
				: "unhandled-typename",
			pageURL: url
		});
		const finalHTML = Marker.fill(wrappedHTML);
		await fsp.writeFile(outputFilePath, formatHTML(finalHTML));
	}));
};

export async function build(targetName) {
	const resourcePath = getResourcePath(targetName);
	mkdirp(resourcePath);
	await buildHead(targetName);
	await copyDirectory(path.join("tests", "instrumentalisierung"), getTargetPath(targetName), targetName);
	await copyAssets(resourcePath);
	if (!options.skipNetwork) {
		console.time("target#buildEntries");
		await loadNavigation(targetName);
		await buildEntries(targetName);
		console.timeEnd("target#buildEntries");
	}
}
