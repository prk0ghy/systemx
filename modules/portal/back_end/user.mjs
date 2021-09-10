import database from "./database.mjs";
import fs from "fs";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const getByName = name => database.get(`SELECT * FROM feuser WHERE name = ?`, [String(name)]);
export const getByID = id => database.get(`SELECT * FROM feuser WHERE ID = ?`, Number.parseInt(id));

export const add = async (name, email, password="") => {
	const hash = await bcrypt.hash(password, saltRounds);
	const row = await database.run("INSERT INTO feuser (name, password, email, passwordExpired) VALUES (?, ?, ?, 0)", [name, hash, email]);
	return row.lastID;
};

export const deleteUser = id => database.run("DELETE FROM feuser WHERE ID = ?", id);
export const changePW = async (id, pass) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	await database.run("UPDATE feuser SET password = ?, passwordExpired = 0 WHERE ID = ?", [hash, id]);
};
export const expirePW = id => database.run("UPDATE feuser SET passwordExpired = 1 WHERE ID = ?", [id]);
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
	await database.run(`
		CREATE TABLE IF NOT EXISTS feuser(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			email TEXT NOT NULL,
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
