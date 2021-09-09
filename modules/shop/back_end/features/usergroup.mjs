import * as configuration from "../OLD/configuration.mjs";
import * as User from "../user.mjs";
import database from "../database.mjs";
import fs from "fs";

export const getActiveProducts = async id => {
	const rows = await database.all(`SELECT name FROM feuser_product WHERE user = ?`, [Number.parseInt(id)]);
	if (!rows) {
		return [];
	}
	const res = [];
	for (const row of rows) {
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
	// const activeProducts = await getActiveProducts(id);
	for (const p in productList) {
		await database.run("INSERT INTO feuser_product (user, name) VALUES (?, ?)", [id, p]);
	}
};

await (async () => {
	await database.run(`
		CREATE TABLE IF NOT EXISTS feuser_product(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			user INTEGER NOT NULL,
			name TEXT NOT NULL
		)
	`);
	const data = await fs.promises.readFile("modules/shop/back_end/data/user.json");
	const rows = JSON.parse(data.toString());
	rows.forEach(async row => {
		const user = await User.getByName(row.name);
		if (!user) { return; }
		const userID = user.ID|0;
		await addProducts(userID, row.products);
	});
})();
