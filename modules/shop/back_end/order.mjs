import { database, whenDatabaseIsOpened } from "./database.mjs";

const addOrder = ({
	email,
	fe_user_id,
	price_subtotal,
	price_taxes,
	price_total
}) => database.run(`
	INSERT INTO shop_order (
		email,
		fe_user_id,
		price_subtotal,
		price_taxes,
		price_total
	)
	VALUES (?, ?, ?, ?, ?)
`, [
	email,
	fe_user_id,
	price_subtotal,
	price_taxes,
	price_total
]);
export const getNewestIDByUserID = async frontEndUserID => {
	const row = await database.get(`
		SELECT
			ID AS id
		FROM
			shop_order
		WHERE
			fe_user_id = ?
		ORDER BY
			ID DESC
	`, [
		frontEndUserID
	]);
	return row.id;
};
export const addOrderItem = ({
	product_amount,
	product_id,
	product_single_price,
	shop_order_id
}) => database.run(`
	INSERT INTO shop_order_item (
		product_amount,
		product_id,
		product_single_price,
		shop_order_id
	) VALUES (?, ?, ?, ?)
`, [
	product_amount,
	product_id,
	product_single_price,
	shop_order_id
]);
export const add = async (frontEndUser, products) => {
	let total = 0;
	const salesTaxRate = 1.19;
	for (const id in products) {
		total += products[id].price * products[id].amount;
	}
	const subtotal = total / salesTaxRate;
	const shop_order = {
		email: frontEndUser.email,
		fe_user_id: frontEndUser.ID,
		price_subtotal: subtotal,
		price_taxes: total - subtotal,
		price_total: total
	};
	const shop_order_id = await addOrder(shop_order);
	for (const id in products) {
		const shop_order_item = {
			product_amount: products[id].amount,
			product_id: id,
			product_single_price: products[id].price,
			shop_order_id
		};
		await addOrderItem(shop_order_item);
	}
};

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