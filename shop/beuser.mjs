import fs from "fs";
import {dbrun, default as dbm} from "./db.mjs";
import bcrypt from "bcrypt";
const saltRounds = 10;
let db = dbm();
const fsp = fs.promises;

const getUser = async name => new Promise((resolve, reject) => {
	db.get(`SELECT ID,name,password FROM beuser WHERE name = ?`,name,function(err,rows){
		if(err){
			reject(err);
		}else{
			resolve(rows);
		}
	});
});

export const addUser = (name,pass) => {
	const hash = bcrypt.hashSync(pass, saltRounds);
	db.run("INSERT INTO beuser (name,password) VALUES (?,?)",name,hash,function(err){});
};

export const tryLogin = async (name,pass) => {
	let row = await getUser(name);
	if(row == null){return null;}
	if(bcrypt.compareSync(pass, row.password)){
		return row;
	}
	return null;
};

(async () => {
	await dbrun("CREATE TABLE IF NOT EXISTS beuser (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT UNIQUE NOT NULL, password TEXT NOT NULL)");
	let data = await fsp.readFile('shop/data/beuser.json');
	let obj = JSON.parse(data.toString());
	obj.forEach( row => {
		addUser(row.name,row.pass);
	});
})();
