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
	if(!data.guid) {return;}
	if(!data.location) {return;}
	if(!data.domain) {return;}
	if(data.location.length > 1000) {return;}
	const guidPattern = new RegExp(`^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
	const httpPattern = new RegExp(`https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))`);
	if (guidPattern.test(data.guid) && httpPattern.test(data.domain)) {
		await add(data.guid, data.location, data.domain);
	}
};
export default logTracking;
