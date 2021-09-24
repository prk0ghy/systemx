import DB from "./database.mjs";
import fs from "fs";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const getByName = name => DB.get(`SELECT * FROM User WHERE name = ?`, [String(name)]);
export const getByID = id => DB.get(`SELECT * FROM User WHERE ID = ?`, Number.parseInt(id));

export const add = async (name, email, password="") => {
	console.log(name);
	console.log(password);
	const hash = await bcrypt.hash(password, saltRounds);
	const row = await DB.run("INSERT INTO User (name, password, email) VALUES (?, ?, ?)", [name, hash, email]);
	return row.lastID;
};

export const remove = id => DB.run("DELETE FROM User WHERE ID = ?", id);
export const changePassword = async (id, pass) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	await DB.run("UPDATE User SET password = ? WHERE ID = ?", [hash, id]);
};
export const changeEmail = async (id, email) => {
	await DB.run("UPDATE User SET email = ? WHERE ID = ?", [email, id]);
};
export const tryLogin = async (name, pass) => {
	const row = await getByName(name);
	if (!row) {
		return null;
	}
	console.log("Trying as "+name);
	if (await bcrypt.compare(pass, row.password)) {
		console.log("Logging in as "+name);
		delete row.password;
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
			email TEXT
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
