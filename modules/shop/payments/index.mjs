import client from "./payPalClient.mjs";
import { database } from "../database.mjs";
import { makeOrderData } from "./payPal.mjs";
import PayPal from "@paypal/checkout-server-sdk";
export default async () => {
	await database.run(`
		CREATE TABLE IF NOT EXISTS payments(
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			shop_order_id INTEGER NOT NULL,
			paypal_order_id TEXT NOT NULL,
			paypal_capture_id TEXT NOT NULL
		);
	`);
};
export const captureOrder = async (shopOrderID, payPalOrderID) => {
	const request = new PayPal.orders.OrdersCaptureRequest(payPalOrderID);
	request.requestBody({});
	const capture = await client.execute(request);
	const payPalCaptureID = capture
		.result
		.purchase_units[0]
		.payments
		.captures[0]
		.id;
	await database.run(`INSERT INTO payments (shop_order_id, paypal_order_id, paypal_capture_id) VALUES (?, ?, ?)`, [
		shopOrderID,
		payPalOrderID,
		payPalCaptureID
	]);
};
export const makeOrder = cart => {
	const request = new PayPal.orders.OrdersCreateRequest();
	request.prefer("return=representation");
	const orderData = makeOrderData(cart);
	request.requestBody(orderData);
	return client.execute(request);
};
