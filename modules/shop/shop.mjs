import * as cart from "./cart.mjs";
import * as configuration from "./configuration.mjs";
import * as feuser from "./feuser.mjs";
import * as fesession from "./fesession.mjs";
import * as order from "./order.mjs";
import * as template from "./template.mjs";
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

export const reqGetShop = async context => {
	const arr = {};
	arr.title = "Shop";
	context.body = await template.renderPage("shop",arr,true,context);
};

const reqPostShopCheckout = async context => {
	const arr = {};
	arr.title = "Warenkorb";
	context.body = await template.renderPage("checkout",arr,true,context);
};

const tryCreateUser = context => {
	if (context.method !== "POST" || !context.request.body?.email) {
		return false;
	}
	const email = String(context.request.body.email);
	return feuser.add(email, email);
};

const reqPostShopOrder = async context => {
	const products = cart.get(context);
	if (fesession.getUser(context) === undefined) {
		const newUser = await tryCreateUser(context);
		if (!newUser) {
			context.body = await template.renderPage("order", {
				err: "Die E-Mail ist bereits im System vorhanden.",
				title: "Ein Fehler ist aufgetreten!"
			}, true, context);
			return;
		}
		await fesession.start(context,newUser);
		const targetUrl = configuration.absoluteUrl("/checkout");
		console.log(targetUrl);
		context.redirect(targetUrl);
		return;
	}

	const user = await fesession.getUser(context);
	if (!order.add({
		email: user.email,
		fe_user_id: user.ID
	}, products)) {
		context.body = await template.renderPage("order", {
			err: "Bitte überprüfen Sie ihre Bestellung.",
			title: "Ein Fehler ist aufgetreten!"
		}, true, context);
		return;
	}
	await cart.empty();
	context.body = await template.renderPage("order", {
		title: "Vielen Dank für ihre Bestellung.", products
	}, true, context);
};

export const addRoutes = router => {
	router.get ("/",             reqGetShop);
	router.get ("/order",        reqPostShopCheckout);
	router.get ("/checkout",     reqPostShopCheckout);
	router.post("/checkout",     reqPostShopCheckout);
	router.post("/order",        reqPostShopOrder);
};
