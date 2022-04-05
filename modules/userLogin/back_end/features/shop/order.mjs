import * as User from "../../user.mjs";
import DB, { Insert } from "../../database.mjs";
import Filter from "../../filter.mjs";
import { add as userGroupAdd } from "../user/group.mjs";
import { findProduct } from "user-login-common/product.mjs";
import PayPal from "@paypal/checkout-server-sdk";
import config from "../../config.mjs";


export const getSingle = async ID => {
	const order = await DB.get(`SELECT * FROM ShopOrder WHERE ID = ?`, ID);
	if(order){
		order.products = await DB.all("SELECT * FROM ShopOrderItem WHERE shopOrder = ?", ID);
	}
	return order;
};
export const getSingleByPayPalOrderID = async orderID => {
	const res = await DB.get(`SELECT ID FROM ShopOrder WHERE payPalOrderID = ?`, orderID);
	if(!res){return res;}
	return await getSingle(res.ID);
};

const insertItem = ( shopOrder, productID, quantity, priceSingle ) => {
	const values = [shopOrder, productID, quantity, priceSingle];
	return DB.run("INSERT INTO ShopOrderItem (shopOrder, productID, quantity, priceSingle) VALUES (?, ?, ?, ?)", values);
};

const insert = async ( cart, payPalOrderID, priceTotal, priceTaxes, user, invoice ) => {
	const priceSubtotal = priceTotal - priceTaxes;
	const creationTimestamp = Math.floor(Date.now() / 1000);
	const vals = {
		user: user.ID,
		email: user.email,
		accountType: invoice.accountType,
		organization: invoice.organization,
		name: invoice.name,
		address: invoice.address,
		zip: invoice.zip,
		city: invoice.city,
		country: invoice.country,
		creationTimestamp,
		payPalOrderID,
		priceTotal,
		priceTaxes,
		priceSubtotal
	};
	const res = await Insert("ShopOrder", vals);
	const ID = res.lastID;
	if(!ID){return ID;}
	for(const product of cart){
		await insertItem(ID, product.id, 1, product.price );
	}
	return ID;
};
const updateStatus = async ( ID, status ) => {
	const updateTimestamp = Math.floor(Date.now() / 1000);
	return DB.run("UPDATE ShopOrder SET status = ?, updateTimestamp = ? WHERE ID = ?", [status, updateTimestamp, ID]);
};

const environment = process.env.SYSTEMX_MODE === "production"
	? new PayPal.core.LiveEnvironment(config.userLogin.paypal.clientId, config.userLogin.paypal.clientSecret)
	: new PayPal.core.SandboxEnvironment(config.userLogin.paypal.clientId, config.userLogin.paypal.clientSecret);
const client = new PayPal.core.PayPalHttpClient(environment);

Filter("userCreatePayPalOrder", async (v, next) => {
	const user = await User.getByID(v.ses?.user?.ID | 0);
	if (!user){
		v.res.error = "Session not found";
		return v;
	}
	const { cart, invoice } = v.req;
	if (!cart) {
		v.res.error = "Cart not found";
		return v;
	}
	if (!invoice) {
		v.res.error = "Invoice is required";
		return v;
	}
	console.log(invoice);
	const products = cart.map(findProduct);
	if (products.some(product => !product || !product.price)) {
		v.res.error = "Invalid product data";
		return v;
	}
	const priceTotal = products.reduce((accumulator, product) => accumulator + product.price, 0);
	const request = new PayPal.orders.OrdersCreateRequest();
	const payload = {
		intent: "CAPTURE",
		purchase_units: [{
			amount: {
				currency_code: "EUR",
				value: String(priceTotal)
			}
		}]
	};
	request.requestBody(payload);
	const response = await client.execute(request);
	const { result } = response;
	if (result.status !== "CREATED") {
		v.res.error = "General PayPal error";
		console.error(response);
		return v;
	}
	v.res.orderID = result.id;
	const shopOrderID = await insert(products, result.id, priceTotal, 0, user, invoice);
	v.res.shopOrderID = shopOrderID;
	return await next(v);
}, 0, { requiresActivation: true});

Filter("userCapturePayPalOrder", async (v, next) => {
	const user = await User.getByID(v.ses?.user?.ID | 0);
	if (!user) {
		v.res.error = "Session not found";
		return v;
	}
	const { orderID } = v.req;
	if (!orderID) {
		v.res.error = "No order ID specified";
		return v;
	}
	const order = await getSingleByPayPalOrderID(orderID);
	if (!order){
		v.res.error = "No corresponding order found";
		return v;
	}
	const request = new PayPal.orders.OrdersCaptureRequest(orderID);
	request.requestBody({});
	const response = await client.execute(request);
	const { result } = response;
	await updateStatus(order.ID, result.status);
	console.log(order);
	if (result.status !== "COMPLETED") {
		v.res.error = "General PayPal error";
		console.error(response);
		return v;
	}
	await userGroupAdd(user.ID, order.products.map(p => p.productID));
	v.res.isCaptured = true;
	v.res.orderID = order.ID;
	return await next(v);
}, 0, { requiresActivation: true});

await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS ShopOrder (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			email TEXT NOT NULL,

			accountType TEXT NOT NULL,
			organization TEXT NOT NULL,
			name TEXT NOT NULL,
			address TEXT NOT NULL,
			zip TEXT NOT NULL,
			city TEXT NOT NULL,
			country TEXT NOT NULL,

			payPalOrderID TEXT NOT NULL,
			status TEXT DEFAULT "CREATED",
			creationTimestamp INTEGER DEFAULT 0,
			updateTimestamp INTEGER DEFAULT 0,
			priceTotal DECIMAL(8, 2) NOT NULL,
			priceTaxes DECIMAL(8, 2) NOT NULL,
			priceSubtotal DECIMAL(8, 2) NOT NULL
		);
	`);
	await DB.run(`
		CREATE TABLE IF NOT EXISTS ShopOrderItem (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			shopOrder INTEGER NOT NULL REFERENCES ShopOrder(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			productID TEXT NOT NULL,
			quantity INTEGER DEFAULT 1,
			priceSingle DECIMAL(8, 2) NOT NULL
		);
	`);
})();
