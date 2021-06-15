import * as cart from "./cart.mjs";
import * as config from "./config.mjs";
import * as feuser from "./feuser.mjs";
import * as fesession from "./fesession.mjs";
import * as order from "./order.mjs";
import * as template from "./template.mjs";
import {dbrun} from "./db.mjs";

const reqShopRedirect = ctx => {
	ctx.redirect(config.absoluteUrl(''));
}

export const reqGetShop = async ctx => {
	let arr   = {};
	arr.title = 'Shop';
	ctx.body  = await template.renderPage('shop',arr,true,ctx);
}

const reqPostShopCheckout = async ctx => {
	let arr         = {};
	arr.title       = 'Warenkorb';
	ctx.body        = await template.renderPage('checkout',arr,true,ctx);
}

const tryCreateUser = async ctx => {
	if(ctx.method !== 'POST')               {return false;}
	if(ctx.request.body === undefined)      {return false;}
	if(ctx.request.body.email === undefined){return false;}
	const email = ctx.request.body.email+'';
	return await feuser.addNoPassword(email,email);
}

const reqPostShopOrder = async ctx => {
	let products = cart.get(ctx);

	if(fesession.getUser(ctx) === undefined){
		const newUser = await tryCreateUser(ctx);
		if(newUser === false){
			return ctx.body = await template.renderPage('order',{title:"Ein Fehler ist aufgetreten!",err:"Die E-Mail ist bereits im System vorhanden."},true,ctx);
		}
		await fesession.start(ctx,newUser);
		const targetUrl = config.absoluteUrl('/checkout');
		console.log(targetUrl);
		ctx.redirect(targetUrl);
		return;
	}

	const user = await fesession.getUser(ctx);
	if(!order.add({"fe_user_id":user.ID,"email":user.email},products)){
		return ctx.body = await template.renderPage('order',{title:"Ein Fehler ist aufgetreten!",err:"Bitte ueberpruefen Sie ihre Bestellung."},true,ctx);
	}

	await cart.empty();
	ctx.body = await template.renderPage('order',{title:"Vielen dank fuer ihre Bestellung",products},true,ctx);
}

export const addRoutes = router => {
	router.get ('/',             reqGetShop);
	router.get ('/order',        reqPostShopCheckout);
	router.get ('/checkout',     reqPostShopCheckout);
	router.post('/checkout',     reqPostShopCheckout);
	router.post('/order',        reqPostShopOrder);
};

(async () => {
	await dbrun("CREATE TABLE IF NOT EXISTS shop_order      (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, fe_user_id INTEGER NOT NULL, email TEXT NOT NULL, price_total DECIMAL(8,2) NOT NULL, price_taxes DECIMAL(8,2) NOT NULL, price_subtotal DECIMAL(8,2) NOT NULL);");
	await dbrun("CREATE TABLE IF NOT EXISTS shop_order_item (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, shop_order_id INTEGER NOT NULL, product_id TEXT NOT NULL, product_amount INTEGER NOT NULL, product_single_price DECIMAL(8,2) NOT NULL);");
})();