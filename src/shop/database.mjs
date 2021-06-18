import sqlite3 from "sqlite3";
import { open } from "sqlite";
export let database;
export const initialize = async () => {
	database = await open({
		driver: sqlite3.Database,
		filename: "dist/local_data.sqlite"
	});
};
