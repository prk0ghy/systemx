import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { mkdirp } from "../../common/fileSystem.mjs";
import options from "../../common/options.mjs";

await mkdirp(options.storagePath);

const database = await open({
	driver: sqlite3.Database,
	filename: options.storagePath + "/local_data.sqlite"
});
export default database;
