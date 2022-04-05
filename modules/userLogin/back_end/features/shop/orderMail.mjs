import Filter from "../../filter.mjs";
import Template from "systemx-common/template.mjs";
import Options from "systemx-common/options.mjs";
import * as User from "../../user.mjs";
import { formatPrice } from "systemx-common/format.mjs";
import { findProduct } from "user-login-common/product.mjs";
import { sendRaw } from "systemx-common/mail.mjs";
import { getSingle } from "./order.mjs";
import { convert } from "html-to-text";

const renderProduct = row => {
	const productData = findProduct(row.productID);
	const data = {
		...row,
		...productData,
		price: formatPrice(row.priceSingle * row.quantity)
	};
	return Template("orderProduct.html", data);
};

const subjectRegex = /<title>([^<]*)<\/title>/;
export const sendInvoiceMail = async orderID => {
	const order = await getSingle(orderID);
	if (!order) {
		console.error("Error trying to send invoice, something went terribly wrong");
		return;
	}
	const user = await User.getByID(order.user);
	if (!user){return;}
	const data = {
		...order,
		priceTotal: formatPrice(order.priceTotal),
		priceSubtotal: formatPrice(order.priceSubtotal),
		priceTaxes: formatPrice(order.priceTaxes),
		userName: user.name,
		creationDate: new Date(order.creationTimestamp * 1000).toLocaleString('de-DE'),
		productTable: (await Promise.all(order.products.map(renderProduct))).join("")
	};
	const from = Options.mailFrom;
	const to = user.email;
	const html = await Template("order.html", data);
	const matches = String(html).match(subjectRegex);
	const text = convert(html);
	if(!matches || (matches.length < 2)){
		console.error("Couldn't find a valid <title> in order.html");
		return;
	}
	const subject = String(matches[1]);
	console.log(`Sending out an E-Mail`);
	await sendRaw({from,to,subject,html,text});
};
Filter("userCapturePayPalOrder", async (v, next) => {
	await sendInvoiceMail(v.res.orderID);
	v.res.invoiceSent = true;
	return await next(v);
}, 10);

