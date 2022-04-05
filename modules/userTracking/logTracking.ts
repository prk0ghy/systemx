import * as sqlite3 from 'sqlite3';
export const createDBSchema = async (db: sqlite3.Database): Promise<void> => {
	db.run(`
		CREATE TABLE IF NOT EXISTS Tracks (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			time DATETIME NOT NULL,
			guid TEXT NOT NULL,
			location TEXT NOT NULL,
			domain TEXT NOT NULL
		)
	`);
};

export interface ITrackingData {
    guid: string
    location: string
    domain: string
}
export const add = async (db: sqlite3.Database, data: ITrackingData): Promise<void> => {
	db.run(
		'INSERT INTO Tracks (time, guid, location, domain) VALUES (CURRENT_TIMESTAMP, ?, ?, ?)',
		[data.guid, data.location, data.domain],
	);
};

export const logTracking = async (db: sqlite3.Database, data: ITrackingData): Promise<void> => {
	if (!data.guid || !data.location || !data.domain) {
		return;
	}

	if (data.location.length > 1000) {
		return;
	}

	const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
	const httpPattern = /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/;
	if (guidPattern.test(data.guid) && httpPattern.test(data.domain)) {
		await add(db, data);
	}
};
