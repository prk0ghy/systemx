import fs from "fs";
import {dbget, dbrun, default as dbm} from "./db.mjs";
import bcrypt from "bcrypt";
const saltRounds = 10;
let db = dbm();
const fsp = fs.promises;

const getUser = name => dbget(`SELECT ID,name,password FROM beuser WHERE name = ?`,name);

export const addUser = async (name,pass) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	return await dbrun("INSERT INTO beuser (name,password) VALUES (?,?)",[name,hash]);
};

export const tryLogin = async (name,pass) => {
	let row = await getUser(name);
	if(row == null){return null;}
	if(await bcrypt.compare(pass, row.password)){
		return row;
	}
	return null;
};

(async () => {
	await dbrun("CREATE TABLE IF NOT EXISTS beuser (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT UNIQUE NOT NULL, password TEXT NOT NULL)");
	let data = await fsp.readFile("src/shop/data/beuser.json");
	let obj = JSON.parse(data.toString());
	obj.forEach(async row => {
		if(await getUser(row.name)){return;}
		addUser(row.name,row.pass);
	});
})();
