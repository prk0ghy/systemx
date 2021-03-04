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
const typeHandleMap = new Map([
	["inhalt_inhalt_Entry", contentTypes.content],
	["inhaltsbausteine_videoDatei_BlockType", contentTypes.video]
]);
export const render = contentType => {
	const { __typename: handle } = contentType;
	if (typeHandleMap.has(handle)) {
		return typeHandleMap.get(handle).render(contentType, render);
	}
	console.warn(`Content type "${handle}" is currently not supported.`);
	return `
		<div>Unsupported content type: ${handle}</div>
	`;
};
