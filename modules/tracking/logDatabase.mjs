import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { mkdirp } from "../common/fileSystem.mjs";
import options from "../common/options.mjs";
import path from "path";

await mkdirp(options.storagePath);

const database = await open({
	driver: sqlite3.Database,
	filename: path.join(options.storagePath, "tracking_data.sqlite")
});
export default database;
