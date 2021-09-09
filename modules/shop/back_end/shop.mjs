import { database, whenDatabaseIsOpened } from "./database.mjs";

whenDatabaseIsOpened(async () => {
	await database.run(`
		CREATE TABLE IF NOT EXISTS shop_order(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			fe_user_id INTEGER NOT NULL,
			email TEXT NOT NULL,
			price_total DECIMAL(8, 2) NOT NULL,
			price_taxes DECIMAL(8, 2) NOT NULL,
			price_subtotal DECIMAL(8, 2) NOT NULL
		);
	`);
	await database.run(`
		CREATE TABLE IF NOT EXISTS shop_order_item(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			shop_order_id INTEGER NOT NULL,
			product_id TEXT NOT NULL,
			product_amount INTEGER NOT NULL,
			product_single_price DECIMAL(8, 2) NOT NULL
		);
	`);
});

export const requestGetShop = async context => {
	const values = {};
	values.title = "Shop";
	context.body = "GET Shop";
};