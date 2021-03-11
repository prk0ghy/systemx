import fs from "fs";
import getPackageDirectory from "pkg-dir";
import { hash as computeHash } from "./crypto.mjs";
import path from "path";
import URL from "url";
const contentTypePaths = Object.fromEntries(await (async () => {
	const root = await getPackageDirectory();
	const directory = path.join(root, "back_end", "content_types");
	const fileList = await fs.promises.readdir(directory);
	const moduleExtension = ".mjs";
	return (await Promise.all(fileList.map(async fileName => {
		if (!fileName.endsWith(moduleExtension)) {
			return null;
		}
		const name = path.basename(fileName, moduleExtension);
		const modulePath = path.join(directory, fileName);
		return [
			name,
			URL.pathToFileURL(modulePath)
		];
	})))
		.filter(Boolean);
})());
const contentTypes = (await (async () => {
	return Promise.all(Object.entries(contentTypePaths).map(async ([name, contentTypePath]) => {
		try {
			const { default: render } = await import(contentTypePath);
			return [name, render];
		}
		catch (error) {
			console.error(`Couldn't load content-type module at ${contentTypePath}`);
			console.error(error);
			return null;
		}
	}));
})())
	.reduce((accumulator, [name, render]) => {
		accumulator[name] = {
			render
		};
		return accumulator;
	}, {});
const rendererMap = new Map([
	["inhalt_inhalt_Entry", contentTypes.content],
	["inhaltsbausteine_textMitOhneBild_BlockType", contentTypes.textAndImage],
	["inhaltsbausteine_ueberschrift_BlockType", contentTypes.header],
	["inhaltsbausteine_videoDatei_BlockType", contentTypes.video],
	["inhaltsbausteine_heroimage_BlockType", contentTypes.heroimage],
]);
const alreadyWarnedTypes = new Set();
export const getName = typeName => {
	if (!rendererMap.has(typeName)) {
		return "unhandled-typename";
	}
	const renderer = rendererMap.get(typeName);
	for (const [key, value] of Object.entries(contentTypes)) {
		if (value === renderer) {
			return key;
		}
	}
};
export const hash = await (async () => {
	const hashInput = (await Promise.all(Object.entries(contentTypePaths).map(async ([name, path]) => {
		const fileContent = await fs.promises.readFile(path, "utf-8");
		return `${name}-${computeHash(fileContent)}`;
	})))
		.join("|");
	return computeHash(hashInput);
})();
export const render = (contentType, context = null) => {
	const { __typename: type } = contentType;
	const renderer = rendererMap.get(type);
	if (renderer) {
		return renderer.render(contentType, {
			context,
			render
		});
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
