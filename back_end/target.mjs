import * as css from "./css.mjs";
import * as js from "./js.mjs";
import * as resources from "./resources.mjs";
import beautify from "js-beautify";
import fs from "fs";
import path from "path";
import query from "./cms.mjs";
import { render } from "./content_types.mjs";

const fsp = fs.promises;
const resourceDirectoryName = "res";

async function mkdirp(...pathParts) {
	const joinedPath = path.join(...pathParts);
	try {
		await fs.mkdirSync(joinedPath, { recursive: true });
	} catch (error) {
		console.error("Directory creation has failed.", error);
	}
	return joinedPath;
}

function getTargetPath(targetName) {
	return path.join("web", targetName);
}

function getResourcePath(targetName) {
	return path.join(getTargetPath(targetName), resourceDirectoryName);
}

async function getHead(targetName) {
	const resourcePath = getResourcePath(targetName);
	const cssContent = await css.get();
	const cssFilename = path.join(resourcePath, "main.css");
	await fsp.writeFile(cssFilename, cssContent);

	const jsContent = await js.get();
	const jsFilename = path.join(resourcePath, "main.js");
	await fsp.writeFile(jsFilename, jsContent);

	let head = "";
	head += `<style>${await css.getInline()}</style>`;
	head += `<link rel="stylesheet" type="text/css" href="/${resourceDirectoryName}/main.css"/>`;
	head += `<script defer type="text/javascript" src="/${resourceDirectoryName}/main.js"></script>`;

	return head;
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
	const head = await getHead(targetName);
	const html = fileContent.replace("</head>", head + "</head>");
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
	const targetPath = getTargetPath(targetName);
	return Promise.all(result.entries.map(async entry => {
		const html = await render(entry);
		const directory = await mkdirp(targetPath, entry.uri);
		const outputFilePath = path.join(directory, "index.html");
		await fsp.writeFile(outputFilePath, beautify.html(html));
	}));
};

export async function build(targetName, doBuildEntries) {
	const resourcePath = getResourcePath(targetName);
	mkdirp(resourcePath);
	await copyDirectory(path.join("tests", "instrumentalisierung"), getTargetPath(targetName), targetName);
	await copyAssets(resourcePath);
	if(doBuildEntries){
		await buildEntries(targetName);
	}
}
