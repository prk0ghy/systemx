import DB from "./database.mjs";
import fs from "fs";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const getByName = name => DB.get(`SELECT * FROM User WHERE name = ?`, [String(name)]);
export const getByID = id => DB.get(`SELECT * FROM User WHERE ID = ?`, Number.parseInt(id));

export const add = async (name, email, password="") => {
	const hash = await bcrypt.hash(password, saltRounds);
	const row = await DB.run("INSERT INTO User (name, password, email, passwordExpired) VALUES (?, ?, ?, 0)", [name, hash, email]);
	return row.lastID;
};

export const deleteUser = id => DB.run("DELETE FROM User WHERE ID = ?", id);
export const changePW = async (id, pass) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	await DB.run("UPDATE User SET password = ?, passwordExpired = 0 WHERE ID = ?", [hash, id]);
};
export const expirePW = id => DB.run("UPDATE User SET passwordExpired = 1 WHERE ID = ?", [id]);
export const tryLogin = async (name, pass) => {
	const row = await getByName(name);
	if (!row) {
		return null;
	}
	console.log("Trying as "+name);
	if (await bcrypt.compare(pass, row.password)) {
		console.log("Logging in as "+name);
		return row;
	}
	return null;
};

await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS User (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			email TEXT,
			passwordExpired INTEGER DEFAULT 0
		)
	`);
	const data = await fs.promises.readFile("modules/portal/back_end/data/user.json");
	const rows = JSON.parse(data.toString());
	rows.forEach(async row => {
		const user = await getByName(row.name);
		if (user) { return; }
		await add(row.name, row.email, row.pass);
	});
})();
