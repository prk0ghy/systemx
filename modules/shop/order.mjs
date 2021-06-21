import { database } from "./database.mjs";
export default async () => {
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
};
const checkInvoiceData = data => data.fe_user_id !== undefined;
const checkProductData = data => data !== undefined;
const addOrder = ({
	email,
	fe_user_id,
	price_total,
	price_taxes,
	price_subtotal
}) => database.run(`
	INSERT INTO shop_order (
		fe_user_id,
		email,
		price_total,
		price_taxes,
		price_subtotal
	)
	VALUES (?, ?, ?, ?, ?)
`, [
	fe_user_id,
	email,
	price_total,
	price_taxes,
	price_subtotal
]);
export const addOrderItem = ({
	product_amount,
	product_id,
	product_single_price,
	shop_order_id
}) => database.run(`
	INSERT INTO shop_order_item (
		shop_order_id,
		product_id,
		product_amount,
		product_single_price
	) VALUES (?, ?, ?, ?)
`, [
	shop_order_id,
	product_id,
	product_amount,
	product_single_price
]);
export const add = async (invoice_data, products) => {
	if (!checkInvoiceData(invoice_data)) {
		return false;
	}
	if (!checkProductData(products)) {
		return false;
	}
	let total = 0;
	for (const id in products) {
		total += products[id].price * products[id].amount;
	}
	const subtotal = total / 1.19;
	const shop_order = {
		email:  invoice_data.email,
		fe_user_id: invoice_data.fe_user_id,
		price_subtotal: subtotal,
		price_taxes: total - subtotal,
		price_total: total
	};
	const shop_order_id = await addOrder(shop_order);
	if (shop_order_id === false) {
		return false;
	}
	for (const id in products) {
		const shop_order_item = {
			product_amount: products[id].amount,
			product_id: id,
			product_single_price: products[id].price,
			shop_order_id: shop_order_id
		};
		await addOrderItem(shop_order_item);
	}
	return true;
};
/*
get = ctx => {
	const sesid = ctx.cookies.get(configuration.get("cartSessionCookie"));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		return getFancyCart(carts[sesid]);
	}
	return {};
}*/
