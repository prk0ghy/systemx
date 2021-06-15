import sqlite3 from "sqlite3";
const db         = new sqlite3.Database('local_data.db');

export const dbrun = (statement, data = []) => new Promise((resolve,reject) => {
    db.run(statement,data,error => {
        if(error === null){
            resolve("");
        }else{
            reject(error);
        }
    });
});

const getDB = () => db;
export default getDB;
