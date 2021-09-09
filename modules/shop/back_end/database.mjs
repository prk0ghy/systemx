import sqlite3 from "sqlite3";
import { open } from "sqlite";
import options from "../../common/options.mjs";
import path from "path";

const database = await open({
	driver: sqlite3.Database,
	filename: path.join(options.storagePath, "local_data.sqlite")
});
export default database;
