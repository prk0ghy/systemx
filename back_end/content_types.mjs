import fs from "fs";
import getPackageDirectory from "pkg-dir";
import path from "path";
const contentTypes = await (async () => {
	const root = await getPackageDirectory();
	const directory = path.join(root, "back_end", "content_types");
	const fileList = await fs.promises.readdir(directory);
	return (await Promise.all(fileList.map(async fileName => {
		const name = path.basename(fileName, ".mjs");
		const { default: render } = await import(path.join(directory, fileName));
		return [name, render];
	}))).reduce((accumulator, [name, render]) => {
		accumulator[name] = {
			render
		};
		return accumulator;
	}, {});
})();
export const render = contentType => {
	switch (contentType.typeHandle) {
		case "inhalt": {
			return `
				<title>${contentType.title}</title>
				${contentTypes.header.render()}
			`;
		}
		default: {
			console.warn(`Rendering support for content type "${contentType.typeHandle}" is currently not supported.`);
			return `
				<div>Unsupported content type</div>
			`;
		}
	}
};
