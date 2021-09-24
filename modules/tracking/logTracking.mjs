import DB from "./logDatabase.mjs";

await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS Tracks (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			time DATETIME NOT NULL,
			guid TEXT NOT NULL,
			location TEXT NOT NULL,
			domain TEXT NOT NULL
		)
	`);
})();

export const add = async (guid, location, domain) => {
	await DB.run("INSERT INTO Tracks (time, guid, location, domain) VALUES (CURRENT_TIMESTAMP, ?, ?, ?)", [guid, location, domain]);
};


const logTracking = async data => {
	if (data.guid !== null && data.location !== null && data.domain !== null) {
		await add(data.guid, data.location, data.domain);
	}
};
export default logTracking;
