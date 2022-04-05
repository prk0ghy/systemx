import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import {mkdirp} from 'systemx-common/fileSystem.mjs';
import path from 'path';

/**
 * Create the sqlite3 database connection.
 * @returns sqlite3 Database object.
 */
export const createLogTrackingDatabase = async () => {
	const storageDir = process.env.USER_TRACKING_STORAGE_PATH;
	if (!storageDir) {
		throw new Error('no storage path specified');
	}

	const storagePath = path.join(storageDir, 'tracking_data.sqlite');
	await mkdirp(storageDir);
	const database = await open({
		driver: sqlite3.Database,
		filename: storagePath,
	});
	console.log(`using: '${storagePath}`);
	return database;
};

/**
 * User-Tracking database.
 */
export const DB = await createLogTrackingDatabase();
