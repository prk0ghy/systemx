import fs from "fs";
import getPackageDirectory from "pkg-dir";
import path from "path";
const contentTypes = await (async () => {
	const root = await getPackageDirectory();
	const directory = path.join(root, "back_end", "content_types");
	const fileList = await fs.promises.readdir(directory);
	const moduleExtension = ".mjs";
	return (await Promise.all(fileList.map(async fileName => {
		if (!fileName.endsWith(moduleExtension)) {
			return null;
		}
		const name = path.basename(fileName, moduleExtension);
		const { default: render } = await import(path.join(directory, fileName));
		return [name, render];
	})))
		.filter(Boolean)
		.reduce((accumulator, [name, render]) => {
			accumulator[name] = {
				render
			};
			return accumulator;
		}, {});
})();
const rendererMap = new Map([
	["inhalt_inhalt_Entry", contentTypes.content],
	["inhaltsbausteine_ueberschrift_BlockType", contentTypes.header],
	["inhaltsbausteine_videoDatei_BlockType", contentTypes.video]
]);
const alreadyWarnedTypes = new Set();
export const render = async contentType => {
	const { __typename: type } = contentType;
	const renderer = rendererMap.get(type);
	if (renderer) {
		return `
			<section content-type="${ type }">
				<div class="inner-content">
					${await renderer.render(contentType, render)}
				</div>
			</section>
		`;
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
