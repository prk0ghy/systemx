import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { mkdirp } from "systemx-common/fileSystem.mjs";
import Logger from "./logger.mjs";
import config from "./config.mjs";

const schemaVersion = 0;

const createDatabase = async () => {
	await mkdirp(config.userLogin.storagePath);
	const db = await open({
		driver: sqlite3.Database,
		filename: config.userLogin.storagePath + "/local_data.sqlite"
	});
	Logger.info(`using ${config.userLogin.storagePath}`);
	// required for cascading
	// disabled by default
	// https://www.sqlite.org/foreignkeys.html#fk_enable
	await db.get("PRAGMA foreign_keys = ON");
	const { user_version } = await db.get("PRAGMA user_version");
	Logger.info(`running on schema version: ${user_version}`);
	// this is for running migrations later on
	if (user_version !== schemaVersion) {
		throw new Error(`incompatible schema version: db: ${user_version}, required:${schemaVersion}`);
	}
	Logger.info("successfully initiated database connection");
	return db;
};

const DB = await createDatabase();

export const Insert = (table, vals) => {
	const cols = Object.keys(vals);
	const values = cols.map(col => vals[col]);
	return DB.run(`INSERT INTO ${table} (${ cols.join(',') }) VALUES (${ cols.map(() => "?").join(",") })`, values);
};
export default DB;
