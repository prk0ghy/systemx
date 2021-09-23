import DB from "./logDatabase.mjs";

await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS Tracks (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			time DATETIME NOT NULL,
			guid TEXT NOT NULL,
			location TEXT NOT NULL
		)
	`);
})();

export const add = async (guid, location) => {
	await DB.run("INSERT INTO Tracks (time, guid, location) VALUES (CURRENT_TIMESTAMP, ?, ?)", [guid, location]);
};


const logTracking = async data => {
	if (data.guid !== null && data.location !== null) {
		await add(data.guid, data.location);
	}
};
export default logTracking;
