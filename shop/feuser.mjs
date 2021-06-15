import fs from 'fs';
import bcrypt from 'bcrypt';
import {dbrun, default as dbm} from "./db.mjs";
import * as config from "./config.mjs";
const saltRounds = 10;
const db         = dbm();
const fsp = fs.promises;

export const getByName = async name => {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM feuser WHERE name = ?`,name,function(err,rows){
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});
}

export const getByID = async id => {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM feuser WHERE ID = ?`,id|0,function(err,rows){
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});
}

export const getAll = async () => {
	return new Promise((resolve, reject) => {
		db.all(`SELECT ID,name FROM feuser`,function(err,rows){
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});
}

export const getActiveProds = async id => new Promise((resolve, reject) => {
	db.all(`SELECT name FROM feuser_product WHERE user = ?`,id|0,function(err,rows){
		if(err){
			reject(err);
			return;
		}
		let res = [];
		rows.forEach( row => {
			let prod = config.getProduct(row.name);
			if(prod === undefined){return;}
			res[row.name] = prod;
		});
		resolve(res);
	});
});

export const addProds = async (id,prods) => {
	let prodList = [];
	prods.forEach( name => {prodList[name] = name;} );
	let activeProds = await getActiveProds(id);
	for(let p in prodList){
		if(!prodList.hasOwnProperty(p) || activeProds[p]){continue;}
		db.run('INSERT INTO feuser_product (user,name) VALUES (?,?)',id,p,function(err){});
	}
}

export const add = async (name,pass,email) => new Promise(async (resolve, reject) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	console.log("Add "+name);
	db.run("INSERT INTO feuser (name,password,email,passwordExpired) VALUES (?,?,?,0)",name,hash,email,function(err){
		if(err){
			reject(err);
		}else{
			resolve(this.lastID);
		}
	});
});

export const addNoPassword = async (name,email) => new Promise(async (resolve, reject) => {
	console.log("Add "+name);
	db.run("INSERT INTO feuser (name,password,email,passwordExpired) VALUES (?,?,?,1)",name,"",email,function(err){
		if(err){
			reject(err);
		}else{
			resolve(this.lastID);
		}
	});
});

export const deleteUser = id => {
	db.run("DELETE FROM feuser WHERE ID=?",id,function(err){});
};

export const changePW = (id,pass) => {
	const hash = bcrypt.hashSync(pass, saltRounds);
	db.run("UPDATE feuser SET password=?,passwordExpired=0 WHERE ID=?",hash,id,function(err){});
};

export const expirePW = id => {
	db.run("UPDATE feuser SET passwordExpired=1 WHERE ID=?",id,function(err){});
};

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
		let userid = await add(row.name,row.pass,row.email);
		await addProds(userid,row.products);
	});
})();
