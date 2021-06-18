import fs from "fs";
import getPackageDirectory from "pkg-dir";
import path from "path";
import URL from "url";
const recurseDirectory = async (directory, types) => {
	const fileList = await fs.promises.readdir(directory, {
		withFileTypes: true
	});
	await Promise.all(fileList.map(async directoryEntry => {
		const moduleExtension = ".mjs";
		const { name: fileName } = directoryEntry;
		if (directoryEntry.isDirectory()) {
			const subdirectory = path.join(directory, directoryEntry.name);
			await recurseDirectory(subdirectory, types);
		}
		if (!fileName.endsWith(moduleExtension)) {
			return;
		}
		const moduleName = path.basename(fileName, moduleExtension);
		const moduleURL = URL.pathToFileURL(path.join(directory, fileName));
		try {
			const module = await import(moduleURL.pathname);
			const parts = directory.split(path.sep);
			const lastPart = parts[parts.length - 1];
			const isEntryType = lastPart === "entry";
			types.set(moduleName, {
				isEntryType,
				module
			});
		}
		catch (error) {
			console.error(`Couldn't load type module at ${moduleURL}`);
			console.error(error);
		}
	}));
};
const loadTypes = async directoryName => {
	const types = new Map();
	const root = await getPackageDirectory();
	const directory = path.join(root, "src", "ssg", "back_end", "types", directoryName);
	await recurseDirectory(directory, types);
	return types;
};
export const loadContentTypes = () => loadTypes("content");
export const loadHelperTypes = () => loadTypes("helper");