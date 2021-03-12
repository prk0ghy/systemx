import getPackageDirectory from "pkg-dir";
import fs from "fs";
import path from "path";
import URL from "url";


const contentTypes = {};
const rendererMap  = new Map();
const alreadyWarnedTypes = new Set();

export async function init() {
	const root           = await getPackageDirectory();
	const directory      = path.join(root, "back_end", "content_types");
	const fileList       = await fs.promises.readdir(directory);
	const modulePromises = [];

	for(const fileName of fileList){
		if (!fileName.endsWith(".mjs")) {continue;}
		const name      = path.basename(fileName, ".mjs");
		const moduleURL = URL.pathToFileURL(path.join(directory, fileName));

		modulePromises.push((async () => {
			try {
				const mod = await import(moduleURL);
				contentTypes[name] = mod;
				for(const rendererName of mod.getRenderer()){
					rendererMap.set(rendererName,name);
				}
			} catch (error) {
				console.error(`Couldn't load content-type module at ${moduleURL}`);
				console.error(error);
			}
		})());
	}
	await Promise.all(modulePromises);
}

export function getName(typeName){
	return rendererMap.has(typeName) ? rendererMap.get(typeName) : "unhandled-typename";
}

export async function render(contentType, context = null) {
	const { __typename: type } = contentType;
	const rendererName = rendererMap.get(type);
	if (rendererName) {
		return contentTypes[rendererName].render(contentType, {context, render});
	}
	if (!alreadyWarnedTypes.has(type)) {
		console.warn(`Content type "${type}" is currently not supported.`);
		alreadyWarnedTypes.add(type);
	}
	return `
		<section content-type="error">
			<div class="inner-content">Unsupported content type: ${type}</div>
		</section>
	`;
};
