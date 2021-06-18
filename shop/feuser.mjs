import fs from 'fs';
import bcrypt from 'bcrypt';
import {dbinsert,dbget,dball,dbrun, default as dbm} from "./db.mjs";
import * as config from "./config.mjs";
const saltRounds = 10;
const db         = dbm();
const fsp = fs.promises;

export const getByName = name => dbget(`SELECT * FROM feuser WHERE name = ?`,[String(name)]);
export const getByID = id => dbget(`SELECT * FROM feuser WHERE ID = ?`,id|0);
export const getAll = () => dball(`SELECT ID,name FROM feuser`,[]);

export const getActiveProds = async id => {
	const rows = await dball(`SELECT name FROM feuser_product WHERE user = ?`,[id|0]);
	if(!rows){return [];}
	let res = [];
	for(row of rows){
		let prod = config.getProduct(row.name);
		if(!prod){continue;}
		res[row.name] = prod;
	}
	return res;
};

export const addProds = async (id,prods) => {
	let prodList = [];
	prods.forEach( name => {prodList[name] = name;} );
	let activeProds = await getActiveProds(id);
	for(let p in prodList){
		if(!prodList.hasOwnProperty(p) || activeProds[p]){continue;}
		await dbrun('INSERT INTO feuser_product (user,name) VALUES (?,?)',[id,p]);
	}
}

export const add = async (name,email,pass="") => {
	const hash = await bcrypt.hash(pass, saltRounds);
	console.log("Add "+name);
	return dbinsert("INSERT INTO feuser (name,password,email,passwordExpired) VALUES (?,?,?,0)",[name,hash,email]);
};

export const deleteUser = id => dbrun("DELETE FROM feuser WHERE ID=?",id);
export const changePW = async (id,pass) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	await dbrun("UPDATE feuser SET password=?,passwordExpired=0 WHERE ID=?",[hash,id]);
};

export const expirePW = id => dbrun("UPDATE feuser SET passwordExpired=1 WHERE ID=?",[id]);

export const tryLogin = async (name,pass) => {
	console.log("Trying to login "+name);
	let row = await getByName(name);
	if(row == null){return null;}
	console.log("Comparing for "+name);
	if(await bcrypt.compare(pass, row.password)){
		return row;
	}
	return null;
};

(async () => {
	await dbrun("CREATE TABLE IF NOT EXISTS feuser (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL, passwordExpired INTEGER DEFAULT 0)");
	await dbrun("CREATE TABLE IF NOT EXISTS feuser_product (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user INTEGER NOT NULL, name TEXT NOT NULL)");
	let data = await fsp.readFile('shop/data/feuser.json');
	let obj = JSON.parse(data.toString());

	obj.forEach( async row => {
		let user   = await getByName(row.name);
		if(user !== undefined){return;}
		let userid = await add(row.name,row.email,row.pass);
		await addProds(userid,row.products);
	});
})();
