import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs-extra';
import config from './config';

/**
 * Create the sqlite3 database connection.
 * @returns sqlite3 Database object.
 */
export const createLogTrackingDatabase = async (): Promise<sqlite3.Database> => {
	if (!config.storagePath) {
		throw new Error('no storage path specified');
	}

	const storagePath = path.join(config.storagePath, 'tracking_data.sqlite');
	if (!fs.existsSync(storagePath)) {
		await fs.mkdir(config.storagePath);
	}

	const db = new sqlite3.Database(storagePath);
	console.log(`using: '${storagePath}'`);
	return db;
};
