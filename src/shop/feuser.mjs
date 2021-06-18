import * as configuration from "./configuration.mjs";
import { database } from "./database.mjs";
import fs from "fs";
import bcrypt from "bcrypt";
const saltRounds = 10;
export default async () => {
	await database.run(`
		CREATE TABLE IF NOT EXISTS feuser(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			email TEXT NOT NULL,
			passwordExpired INTEGER DEFAULT 0
		)
	`);
	await database.run(`
		CREATE TABLE IF NOT EXISTS feuser_product(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			user INTEGER NOT NULL,
			name TEXT NOT NULL
		)
	`);
	let data = await fs.promises.readFile("src/shop/data/feuser.json");
	let rows = JSON.parse(data.toString());
	rows.forEach(async row => {
		const user = await getByName(row.name);
		if (user) {
			return;
		}
		let userID = await add(row.name, row.email, row.pass);
		await addProducts(userID, row.products);
	});
};
export const getByName = name => database.get(`SELECT * FROM feuser WHERE name = ?`, [String(name)]);
export const getByID = id => database.get(`SELECT * FROM feuser WHERE ID = ?`, Number.parseInt(id));
export const getAll = () => database.all(`SELECT ID, name FROM feuser`, []);
export const getActiveProducts = async id => {
	const rows = await database.all(`SELECT name FROM feuser_product WHERE user = ?`, [Number.parseInt(id)]);
	if (!rows) {
		return [];
	}
	const res = [];
	for (row of rows) {
		const product = configuration.getProduct(row.name);
		if (!product) {
			continue;
		}
		res[row.name] = product;
	}
	return res;
};
const addProducts = async (id, products) => {
	const productList = [];
	products.forEach(name => {
		productList[name] = name;
	});
	const activeProducts = await getActiveProducts(id);
	for (const p in productList) {
		if (!productList.hasOwnProperty(p) || activeProducts[p]) {
			continue;
		}
		await database.run("INSERT INTO feuser_product (user, name) VALUES (?, ?)", [id, p]);
	}
};
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
	console.log("Trying to login "+name);
	const row = await getByName(name);
	if (row === null) {
		return null;
	}
	console.log("Comparing for "+name);
	if (await bcrypt.compare(pass, row.password)) {
		return row;
	}
	return null;
};
