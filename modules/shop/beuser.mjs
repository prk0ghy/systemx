import { database } from "./database.mjs";
import bcrypt from "bcrypt";
import fs from "fs";
const saltRounds = 10;
const getUser = name => database.get(`SELECT ID, name, password FROM beuser WHERE name = ?`, name);
export const addUser = async (name, password) => {
	const hash = await bcrypt.hash(password, saltRounds);
	return database.run(`
		INSERT INTO beuser
		(
			name,
			password
		)
		VALUES (?, ?)
	`, [
		name,
		hash
	]);
};
export default async () => {
	await database.run(`
		CREATE TABLE IF NOT EXISTS beuser(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL
		)
	`);
	const data = await fs.promises.readFile("modules/shop/data/beuser.json");
	const rows = JSON.parse(data.toString());
	rows.forEach(async row => {
		if (await getUser(row.name)) {
			return;
		}
		addUser(row.name, row.pass);
	});
};
export const tryLogin = async (name, password) => {
	const row = await getUser(name);
	if (row === null) {
		return null;
	}
	if (await bcrypt.compare(password, row.password)) {
		return row;
	}
	return null;
};
