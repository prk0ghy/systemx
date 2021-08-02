import * as css from "./css.mjs";
import * as js from "./js.mjs";
import { prefixUrl } from "../configuration.mjs";
import { getResourcePath, resourceDirectoryName } from "../target.mjs";
import options from "../../common/options.mjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const fsp = fs.promises;
const resourceNamedHashes = new Map();
const headResources = new Map();

const md5 = data => {
	const secret = "λの秘密";
	return crypto.createHmac("md5", secret).update(data).digest("hex");
};

const resourceTag = filename => {
	const ext   = filename.split('.').pop().toLowerCase();
	const query = resourceNamedHashes.has(filename) ? `?ver=${resourceNamedHashes.get(filename)}` : "";
	const href  = prefixUrl(`/${resourceDirectoryName}/${filename}${query}`);
	if(ext === 'js'){
		return `<script defer type=text/javascript src="${href}"></script>`;
	} else if(ext === 'css') {
		return `<link rel=stylesheet type=text/css href="${href}"></link>`;
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
	console.log(`Build Head for ${targetName}`);
	if (headResources.has(targetName)) {return;}

	const promises = [];
	const resourcePath = getResourcePath(targetName);

	const cssInline   = await css.getInline();
	const cssContent  = await css.get();
	const cssFilename = path.join(resourcePath, "shop_main.css");
	resourceNamedHashes.set("shop_main.css", md5(cssContent));
	promises.push(fsp.writeFile(cssFilename, cssContent));

	const jsContent = await js.get();
	const jsFilename = path.join(resourcePath, "shop_main.js");
	resourceNamedHashes.set("shop_main.js", md5(jsContent));
	promises.push(fsp.writeFile(jsFilename, jsContent));

	await Promise.all(promises);
	let curHead = '';
	curHead += `<style>${cssInline}</style>`;

	curHead += resourceTag('shop_main.css');
	curHead += configCSSVars(targetName);

	curHead += configJSVars();
	curHead += resourceTag('shop_main.js');

	headResources.set(targetName, curHead);
};

const getHead = async targetName => {
	if(!headResources.has(targetName)){
		await buildHead(targetName);
		if(!headResources.has(targetName)){
			console.error(`Error while building head for Shop part of ${targetName}`);
		}
	}
	return `
		<meta charset="utf-8">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		${headResources.get(targetName)}
	`;
};
export default getHead;
