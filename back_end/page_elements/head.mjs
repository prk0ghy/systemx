import * as css from "./css.mjs";
import * as js from "./js.mjs";
import { getResourcePath, resourceDirectoryName } from "../target.mjs";
import fs from "fs";
import path from "path";

const fsp = fs.promises;
const targetsBuilt = new Set();

export default async function(targetName, pageTitle) {
	if (!targetsBuilt.has(targetName)) {
		const promises = [];
		const resourcePath = getResourcePath(targetName);
		const cssContent = await css.get();
		const cssFilename = path.join(resourcePath, "main.css");
		promises.push(fsp.writeFile(cssFilename, cssContent));

		promises.push(fsp.copyFile(path.join("node_modules","quill","dist","quill.min.js"),path.join(resourcePath,"quill.min.js")));
		promises.push(fsp.copyFile(path.join("node_modules","quill","dist","quill.snow.css"),path.join(resourcePath,"quill.snow.css")));

		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","photoswipe-ui-default.min.js"),path.join(resourcePath,"photoswipe-ui-default.min.js")));
		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","photoswipe.min.js"),path.join(resourcePath,"photoswipe.min.js")));
		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","photoswipe.css"),path.join(resourcePath,"photoswipe.css")));

		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","default-skin","default-skin.css"),path.join(resourcePath,"default-skin.css")));
		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","default-skin","default-skin.svg"),path.join(resourcePath,"default-skin.svg")));
		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","default-skin","default-skin.png"),path.join(resourcePath,"default-skin.png")));
		promises.push(fsp.copyFile(path.join("node_modules","photoswipe","dist","default-skin","preloader.gif"),path.join(resourcePath,"preloader.gif")));

		const jsContent = await js.get();
		const jsFilename = path.join(resourcePath, "main.js");
		promises.push(fsp.writeFile(jsFilename, jsContent));

		await Promise.all(promises);
		targetsBuilt.add(targetName);
	}
	return `
		<meta charset="utf-8">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>${pageTitle}</title>
		<style>${await css.getInline()}</style>

		<link rel="stylesheet" type="text/css" href="/${resourceDirectoryName}/quill.snow.css"/>
		<script defer type="text/javascript" src="/${resourceDirectoryName}/quill.min.js"></script>

		<link rel="stylesheet" type="text/css" href="/${resourceDirectoryName}/photoswipe.css"/>
		<link rel="stylesheet" type="text/css" href="/${resourceDirectoryName}/default-skin.css"/>
		<script defer type="text/javascript" src="/${resourceDirectoryName}/photoswipe.min.js"></script>
		<script defer type="text/javascript" src="/${resourceDirectoryName}/photoswipe-ui-default.min.js"></script>

		<link rel="stylesheet" type="text/css" href="/${resourceDirectoryName}/main.css"/>
		<script defer type="text/javascript" src="/${resourceDirectoryName}/main.js"></script>
	`;
}