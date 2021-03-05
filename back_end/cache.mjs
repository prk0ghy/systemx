import { createHash } from "crypto";
import fs from "fs";
const cachePath = ".cache.json";
const schemaVersion = 1;
const defaultCache = {
	entryDateUpdated: {},
	entryResultHashes: {},
	schemaVersion
};
const flush = async error => {
	console.warn("Could not read cache, hence starting a new one.");
	if (error) {
		console.error(error);
	}
	await fs.promises.rm(cachePath, {
		force: true
	});
	return defaultCache;
};
const cache = await (async () => {
	try {
		const cache = JSON.parse(await fs.promises.readFile(cachePath, "utf-8"));
		if (cache.schemaVersion === schemaVersion) {
			return cache;
		}
		return flush(new Error("Wrong schema version"));
	}
	catch (error) {
		return flush();
	}
})();
export default cache;
export const hash = content => createHash("md5").update(content).digest("hex");
export const save = () => fs.promises.writeFile(cachePath, JSON.stringify(cache));
