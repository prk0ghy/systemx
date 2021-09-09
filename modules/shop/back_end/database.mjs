import sqlite3 from "sqlite3";
import { open } from "sqlite";
import options from "../../common/options.mjs";
import path from "path";

const afterOpenCallbacks = [];

export let database = null;
export default database;

(async () => {
	database = await open({
		driver: sqlite3.Database,
		filename: path.join(options.storagePath, "local_data.sqlite")
	});
	afterOpenCallbacks.forEach(cb => cb());
	afterOpenCallbacks.length = 0;
})();

export const whenDatabaseIsOpened = (cb) => {
	if(database){
		cb();
	}else{
		afterOpenCallbacks.push(cb);
	}
};