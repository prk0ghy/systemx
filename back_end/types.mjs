import fs from "fs";
import getPackageDirectory from "pkg-dir";
import path from "path";
import URL from "url";
const loadTypes = async directoryName => {
	const types = new Map();
	const root = await getPackageDirectory();
	const directory = path.join(root, "back_end", "types", directoryName);
	const fileList = await fs.promises.readdir(directory);
	await Promise.all(fileList.map(async fileName => {
		const moduleExtension = ".mjs";
		if (!fileName.endsWith(moduleExtension)) {
			return;
		}
		const moduleName = path.basename(fileName, moduleExtension);
		const moduleURL = URL.pathToFileURL(path.join(directory, fileName));
		try {
			const module = await import(moduleURL);
			types.set(moduleName, module);
		}
		catch (error) {
			console.error(`Couldn't load type module at ${moduleURL}`);
			console.error(error);
		}
	}));
	return types;
};
export const loadContentTypes = () => loadTypes("content");
export const loadHelperTypes = () => loadTypes("helper");
