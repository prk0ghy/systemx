import {getInlineCSS, getCSS, getInlineJS, getJS} from "./resources.mjs";
import { getTargetPath, getResourcePath, resourceDirectoryName } from "../target.mjs";
import options from "systemx-common/options.mjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const fsp = fs.promises;
const resourceNamedHashes = new Map();
const headResources = new Map();


const dateTimeToUnixTime = d => {
	return (new Date(d).getTime()/1000)|0;
};

const md5 = data => {
	const secret = "λの秘密";
	return crypto.createHmac("md5", secret).update(data).digest("hex");
};

const copyResource = async (sourceDir, destDir, filename) => {
	const sourcePath = path.join(sourceDir, filename);
	const destPath   = path.join(destDir  , filename);
	const stats      = await fsp.stat(sourcePath);
	const hash       = dateTimeToUnixTime(stats.mtime);

	resourceNamedHashes.set(filename, hash);

	return fsp.copyFile(sourcePath, destPath);
};

const resourceTag = filename => {
	const ext   = filename.split('.').pop().toLowerCase();
	const query = resourceNamedHashes.has(filename) ? `?ver=${resourceNamedHashes.get(filename)}` : "";
	const href  = `/${resourceDirectoryName}/${filename}${query}`;
	if(ext === 'js'){
		return `<script defer type=text/javascript src="${href}"></script>`;
	} else if(ext === 'css'){
		return `<link rel=stylesheet type=text/css href="${href}">`;
	}
	// Ignore the rest
	return '';
};

const configJSVars = () => {
	return `<script type="text/javascript">
	const configuration = ${JSON.stringify(options.jsVars)};
	</script>`;
};

const configCSSVars = () => {
	const vars = [];
	for(const k in options.cssVars){
		const cssName = `--${k.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
		const v = options.cssVars[k];
		vars.push(`${cssName}: ${v};\n`);
	}
	return `<style>
	:root {
		${vars.join("\n		")}
	}
	</style>`;
};

export const buildHead = async targetName => {
	if (headResources.has(targetName)) {return;}

	const promises = [];
	const resourcePath = getResourcePath(targetName);
	const targetPath = getTargetPath(targetName);

	promises.push(copyResource(`modules/contentPipeline/front_end/themes/core/favicon/${options.favicon}`, targetPath, "favicon.ico"));
	promises.push(copyResource(`modules/contentPipeline/front_end/themes/core/favicon/${options.favicon}`, targetPath, "favicon.svg"));
	promises.push(copyResource(`modules/contentPipeline/front_end/themes/core/favicon/${options.favicon}`, targetPath, "favicon-180.png"));

	promises.push(copyResource("node_modules/quill/dist", resourcePath, "quill.min.js"));
	promises.push(copyResource("node_modules/quill/dist", resourcePath, "quill.min.js.map"));
	promises.push(copyResource("node_modules/quill/dist", resourcePath, "quill.snow.css"));
	promises.push(copyResource("node_modules/photoswipe/dist", resourcePath, "photoswipe-ui-default.min.js"));
	promises.push(copyResource("node_modules/photoswipe/dist", resourcePath, "photoswipe.min.js"));
	promises.push(copyResource("node_modules/photoswipe/dist", resourcePath, "photoswipe.css"));
	promises.push(copyResource("node_modules/photoswipe/dist/default-skin", resourcePath, "default-skin.css"));
	promises.push(copyResource("node_modules/photoswipe/dist/default-skin", resourcePath, "default-skin.svg"));
	promises.push(copyResource("node_modules/photoswipe/dist/default-skin", resourcePath, "default-skin.png"));
	promises.push(copyResource("node_modules/photoswipe/dist/default-skin", resourcePath, "preloader.gif"));

	const cssInline   = await getInlineCSS();
	const cssContent  = await getCSS();
	const cssFilename = `${resourcePath}/main.css`;
	resourceNamedHashes.set("main.css", md5(cssContent));
	promises.push(fsp.writeFile(cssFilename, cssContent));

	const jsInline = await getInlineJS();
	const jsContent = await getJS();
	const jsFilename = `${resourcePath}/main.js`;
	resourceNamedHashes.set("main.js", md5(jsContent));
	promises.push(fsp.writeFile(jsFilename, jsContent));

	await Promise.all(promises);
	let curHead = '';
	curHead += `<style>${cssInline}</style>`;
	curHead += resourceTag('quill.snow.css');
	curHead += resourceTag('photoswipe.css');
	curHead += resourceTag('default-skin.css');

	curHead += resourceTag('main.css');
	curHead += configCSSVars();

	curHead += resourceTag('quill.min.js');
	curHead += resourceTag('photoswipe-ui-default.min.js');
	curHead += resourceTag('photoswipe.min.js');

	curHead += configJSVars();
	curHead += `<script>${jsInline}</script>`;
	curHead += resourceTag('main.js');

	curHead += `<link rel="icon" href="/favicon.svg"/>`;
	curHead += `<link rel="apple-touch-icon" href="/favicon-180.png"/>`;

	headResources.set(targetName, curHead);
};

const getHead = async targetName => {
	if(!headResources.has(targetName)){
		console.error("Trying to build pages before the head could be properly built");
		console.error(headResources);
		return '';
	}
	return `
		<meta charset="utf-8">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		${headResources.get(targetName)}
	`;
};
export default getHead;
