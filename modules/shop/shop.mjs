import * as cart from "./cart.mjs";
import * as frontEndSession from "./fesession.mjs";
import * as order from "./order.mjs";
import * as template from "./template.mjs";
import { database } from "./database.mjs";
import {
	captureOrder as capturePayPalOrder,
	makeOrder as makePayPalOrder
} from "./payments/index.mjs";
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
export const requestGetShop = async context => {
	const values = {};
	values.title = "Shop";
	context.body = await template.renderPage("shop", values, true, context);
};
const requestGetOrder = async context => {
	const values = {
		frontEndUser: frontEndSession.getUser(context)
	};
	values.title = "Warenkorb";
	context.body = await template.renderPage("checkout", values, true, context);
};
const requestPostOrder = async context => {
	const products = cart.get(context);
	// 	if (!frontEndSession.getUser(context)) {
	// 		const newUser = await tryCreateUser(context);
	// 		if (!newUser) {
	// 			context.body = await template.renderPage("order", {
	// 				err: "Die E-Mail ist bereits im System vorhanden.",
	// 				title: "Ein Fehler ist aufgetreten!"
	// 			}, true, context);
	// 			return;
	// 		}
	// 		await frontEndSession.start(context, newUser);
	// 		const targetURL = configuration.absoluteUrl("/checkout");
	// 		context.redirect(targetURL);
	// 		return;
	// 	}
	const user = await frontEndSession.getUser(context);
	await order.add(user, products);
	const payPalOrder = await makePayPalOrder(products);
	context.body = await template.renderPage("payment", {
		payPalClientID: process.env.PAYPAL_CLIENT_ID,
		payPalOrderID: payPalOrder.result.id,
		title: "Bitte bezahlen Sie Ihre Bestellung."
	}, true, context);
};
const requestCaptureCheckout = async context => {
	const user = await frontEndSession.getUser(context);
	const orderID = await order.getNewestIDByUserID(user.ID);
	const payPalOrderID = context.headers["x-paypal-order-id"];
	await capturePayPalOrder(orderID, payPalOrderID);
	context.body = "";
};
const requestOrderDone = async context => {
	const products = cart.get(context);
	await cart.empty();
	context.body = await template.renderPage("order-done", {
		products,
		title: "Vielen Dank für Ihre Bestellung."
	}, true, context);
};
export const addRoutes = router => {
	router.get("/", requestGetShop);
	router.get("/order", requestGetOrder);
	router.get("/order-done", requestOrderDone);
	router.get("/checkout", requestGetOrder);
	router.post("/checkout", requestGetOrder);
	router.post("/checkout/capture", requestCaptureCheckout);
	router.post("/order", requestPostOrder);
};
