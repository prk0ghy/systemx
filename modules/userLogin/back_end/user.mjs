import DB from "./database.mjs";
import fs from "fs";
import bcrypt from "bcrypt";
import options from "../../common/options.mjs";
import Logger from "./logger.mjs";

const saltRounds = 10;

const userFields = ["ID", "name", "email", "isActivated"];
const userFieldQuery = userFields.join(", ");
const userFieldQueryWithPassword = [...userFields, "password"].join(", ");

export const getByName = async (name, withPassword = false) => {
	const user = await DB.get(
		`SELECT ${withPassword ? userFieldQueryWithPassword : userFieldQuery} FROM User WHERE name = ?`,
		[String(name)]
	);
	// sqlite treats boolean as int
	if (user) {
		return {
			...user,
			isActivated: Boolean(user.isActivated)
		};
	}
	return user;
};
export const getByID = async (id, withPassword = false) => {
	const user = await DB.get(
		`SELECT ${withPassword ? userFieldQueryWithPassword : userFieldQuery} FROM User WHERE ID = ?`,
		Number.parseInt(id)
	);
	// sqlite treats boolean as int
	if (user) {
		return {
			...user,
			isActivated: Boolean(user.isActivated)
		};
	}
	return user;
};

/**
 * @param {string} name
 * @param {string}} email
 * @param {string} password
 * @param {boolean} isActivated
 * @returns {number}
 */
export const add = async (name, email, password = "", isActivated = false) => {
	const hash = await bcrypt.hash(password, saltRounds);
	const row = await DB.run("INSERT INTO User (name, password, email, isActivated) VALUES (?, ?, ?, ?)", [name, hash, email, isActivated]);
	return row.lastID;
};
/**
 * @param {number} id
 */
export const remove = id => DB.run("DELETE FROM User WHERE ID = ?", [Number.parseInt(id)]);
/**
 * @param {number} id
 * @param {string} pass
 */
export const changePassword = async (id, pass) => {
	const hash = await bcrypt.hash(pass, saltRounds);
	await DB.run("UPDATE User SET password = ? WHERE ID = ?", [hash, id]);
};
/**
 * @param {number} id
 * @param {string} email
 */
export const changeEmail = async (id, email) => {
	await DB.run("UPDATE User SET email = ? WHERE ID = ?", [email, id]);
};
/**
 * @param {number} id
 * @param {boolean} isActivated
 */
export const setIsActivated = async(id, isActivated) => {
	await DB.run("UPDATE USER SET isActivated = ? WHERE ID = ?", [isActivated, id]);
};
/**
 * @param {string} name
 * @param {string} pass
 * @returns {*}
 */
export const tryLogin = async (name, pass) => {
	const row = await getByName(name, true);
	if (!row) {
		return null;
	}
	Logger.debug(`trying login for: ${name}`);
	if (await bcrypt.compare(pass, row.password)) {
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
			email TEXT,
			isActivated BOOLEAN
		)
	`);
	if (options.mode !== "development") {
		return;
	}
	Logger.debug("seeding development user data");
	const data = await fs.promises.readFile(`modules/userLogin/back_end/data/user.json`);
	const rows = JSON.parse(data.toString());
	rows.forEach(async row => {
		const user = await getByName(row.name);
		if (user) {
			return;
		}
		await add(row.name, row.email, row.pass, true);
	});
})();
