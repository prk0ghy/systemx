import fs from "fs";
import getPackageDirectory from "pkg-dir";
import path from "path";
import URL from "url";

const recurseDirectory = async (directory, types) => {
	const fileList = await fs.promises.readdir(directory, {
		withFileTypes: true
	});
	await Promise.all(fileList.map(async directoryEntry => {
		const { name: fileName } = directoryEntry;
		if (directoryEntry.isDirectory()) {
			const subdirectory = path.join(directory, directoryEntry.name);
			await recurseDirectory(subdirectory, types);
		}
		if (!fileName.endsWith(".mjs")) { return; }
		const moduleName = path.basename(fileName, ".mjs");
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
		} catch (error) {
			console.error(`Couldn't load type module at ${moduleURL}`);
			console.error(error);
		}
	}));
};

const loadModules = async directoryName => {
	const types = new Map();
	const directory = path.join(await getPackageDirectory(), directoryName);
	await recurseDirectory(directory, types);
	return types;
};
export default loadModules;