import sqlite3 from "sqlite3";
const db         = new sqlite3.Database('local_data.db');

export const dbrun = (statement, data = []) => new Promise((resolve,reject) => {
    db.run(statement,data,(error,data) => {
        if(error === null){
            resolve(data);
        }else{
            reject(error);
        }
    });
});

export const dbget = (statement, data = []) => new Promise((resolve, reject) => {
    db.get(statement,data,(error,data) => {
        if(error === null){
            resolve(data);
        }else{
            reject(error);
        }
    })
});

export const dball = (statement, data = []) => new Promise((resolve, reject) => {
    db.all(statement,data,(error,data) => {
        if(error === null){
            resolve(data);
        }else{
            reject(error);
        }
    })
});

const getDB = () => db;
export default getDB;
