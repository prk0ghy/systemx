import * as css from "./css.mjs";
import * as js from "./js.mjs";
import * as resources from "./resources.mjs";
import fs from "fs";

const fsp = fs.promises;

async function mkdirp(path) {
	try {
		await fs.mkdirSync(path);
	}
	catch (error) {
		console.error("Directory creation has failed.", error);
	}
}

function fileExtension(filename) {
	return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
}

async function getHead(targetName) {
	const cssContent = await css.get();
	const cssFilename = "web/" + targetName + "/res/main.css";
	await fsp.writeFile(cssFilename, cssContent);

	const jsContent = await js.get();
	const jsFilename = "web/" + targetName + "/res/main.js";
	await fsp.writeFile(jsFilename, jsContent);

	let ret = "";
	ret += "	<style>\n" + (await css.getInline()) + "\n	</style>\n";
	ret += "	<link rel=\"stylesheet\" type=\"text/css\" href=\"res/main.css\"/>\n";
	ret += "	<script defer type=\"text/javascript\" src=\"res/main.js\"></script>\n";

	return ret;
}

async function renderFile(source, destination, targetName) {
	const tbuf = await fsp.readFile(source);
	const head = await getHead(targetName);
	const html = tbuf.toString().replace("</head>", head + "\n</head>");
	await fsp.writeFile(destination, html);
}

async function copyDir(source, destination, targetName) {
	await mkdirp(destination);
	const fileNames = await fsp.readdir(source);
	const promises = [];
	for (const fileName of fileNames) {
		try {
			const stat = await fsp.stat(source + "/" + fileName);
			if (stat.isFile()) {
				const ext = fileExtension(source + "/" + fileName).toLowerCase();
				if (ext === "html") {
					promises.push(renderFile(source + "/" + fileName, destination + "/" + fileName, targetName));
				}
				else {
					promises.push(fsp.copyFile(source + "/" + fileName, destination + "/" + fileName));
				}
			}
			else if (stat.isDirectory()) {
				promises.push(copyDir(source + "/" + fileName, destination + "/" + fileName, targetName));
			} // Ignore everything else
		}
		catch {/* If we can't stat then just skip */}
	}
	return Promise.all(promises);
}

async function copyAssets(destination) {
	const assetDirectories = await resources.getAssetDirectories();
	return Promise.all(assetDirectories.map(directory => copyDir(directory, destination)));
}

export async function build(targetName) {
	mkdirp("web");
	mkdirp("web/" + targetName);
	mkdirp("web/" + targetName + "/res");
	/* If any of those fail for other reasons, then we will catch that later when we
	 * actually try and write out some files.
	 */
	await copyDir("tests/instrumentalisierung", "web/" + targetName, targetName);
	await copyAssets("web/" + targetName + "/res");
}
