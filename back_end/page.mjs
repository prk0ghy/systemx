import * as css from "./css.mjs";
import * as js from "./js.mjs";
import { getResourcePath, resourceDirectoryName } from "./target.mjs";
import fs from "fs";
import path from "path";

const fsp = fs.promises;
const targetsBuilt = new Set();
async function getHead(targetName, pageTitle) {
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

async function getHeader(){
	return `
		<header>
			<div id="header-left">
				<button id="button-navigation"></button>
			</div>
			<div id="header-center">
				<button id="button-previous"></button>
				<h3>mPublish Lasub</h3>
				<button id="button-next"></button>
			</div>
			<div id="header-right">
				<button id="button-settings"></button>
			</dif>
		</header>
	`;
}

async function getNavigationAside(){
	return `<aside id="navigation" style="display:none;"><nav><ul>
	<li>
		<a href="#">Start</a>
	</li>
	<li>
		<a href="#">Geschichte 1 - Die Stadt im Mittelalter</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
			<li><a href="#">Leben in der Stadt</a></li>
			<li><a href="#">Macht und Herrschaft in den mittelalterlichen St&auml;dten</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Geschichte 2 - Industrialisierung und soziale Frage</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Macht und Herrschaft in den mittelalterlichen St&auml;dten</a></li>
		</ul>
	</li>
	<li class="active">
		<a href="#">Geschichte 3 - Instrumentalisierung der Vergangenheit</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Geschichte 4 - Migration</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Physik - Bewegung von K&ouml;rpern</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Physik - Temperatur und der Zustand von K&ouml;rpern</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Mathe 1 - Zuordnung in der Umwelt</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Mathe 2 - Geometrie in der Ebene</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Kunst 1 - Die Anf&auml;nge der bildnerischen Darstellung</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Macht und Herrschaft in den mittelalterlichen St&auml;dten</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Kunst 2 - Farbe</a>
		<ul>
			<li><a href="#">Leben in der Stadt</a></li>
			<li><a href="#">Macht und Herrschaft in den mittelalterlichen St&auml;dten</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Franz&ouml;sisch 1</a>
		<ul>
			<li><a href="#">St&auml;dteboom im Mittelalter</a></li>
			<li><a href="#">Spurensuche mit Satellit: Was ist eine Stadt im Mittelalter?</a></li>
		</ul>
	</li>
	<li>
		<a href="#">Franz&ouml;sisch 2</a>
		<ul>
			<li><a href="#">Leben in der Stadt</a></li>
			<li><a href="#">Macht und Herrschaft in den mittelalterlichen St&auml;dten</a></li>
		</ul>
	</li>
</ul></nav></aside>`;
}

export default async function wrapWithApplicationShell(targetName, {pageTitle, pageType, content}) {
	const head = await getHead(targetName, pageTitle);
	return `
		<!DOCTYPE html>
		<html lang="de">
			<head>${head}</head>
			<body>
				${await getHeader()}
				${await getNavigationAside()}
				<main content-type="${pageType}">${content}</main>
			</body>
		</html>
	`;
}
