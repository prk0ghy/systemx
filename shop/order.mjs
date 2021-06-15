import {dbrun,default as dbm} from "./db.mjs";
const db = dbm();

const checkInvoiceData = data => {
	return data['fe_user_id'] !== undefined;
};

const checkProductData = data => {
	return data !== undefined;
};

const addOrder = async args => {
	return new Promise(async (resolve, reject) => {
		db.run("INSERT INTO shop_order (fe_user_id,email,price_total,price_taxes,price_subtotal) VALUES (?,?,?,?,?)",args['fe_user_id'],args['email'],args['price_total'],args['price_taxes'],args['price_subtotal'],function(err){
			if(err){
				reject(err);
			}else{
				console.log(this.lastID);
				resolve(this.lastID);
			}
		});
	});
}

export const addOrderItem = async args => new Promise(async (resolve, reject) => {
	db.run("INSERT INTO shop_order_item (shop_order_id, product_id, product_amount, product_single_price) VALUES (?,?,?,?)",args['shop_order_id'],args['product_id'],args['product_amount'],args['product_single_price'],function(err){
		if(err){
			reject(err);
		}else{
			console.log(this.lastID);
			resolve(this.lastID);
		}
	});
});

export const add = async (invoice_data,products) => {
	if(!checkInvoiceData(invoice_data)){return false;}
	if(!checkProductData(products))    {return false;}

	let total = 0;
	for(let id in products){
		if(!products.hasOwnProperty(id)){continue;}
		total += products[id].price * products[id].amount;
	}
	const subtotal = total / 1.19;
	const shop_order = {
		"fe_user_id": invoice_data['fe_user_id'],
		"email":  invoice_data['email'],
		"price_total": total,
		"price_taxes": total - subtotal,
		"price_subtotal": subtotal,
	};
	let shop_order_id = await addOrder(shop_order);
	if(shop_order_id === false){return false;}
	for(let id in products){
		if(!products.hasOwnProperty(id)){continue;}
		let shop_order_item = {
			"shop_order_id": shop_order_id,
			"product_id": id,
			"product_amount": products[id].amount,
			"product_single_price": products[id].price,
		};
		await addOrderItem(shop_order_item);
	}
	return true;
}

/*
get = ctx => {
	let sesid = ctx.cookies.get(config.get('cartSessionCookie'));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		return getFancyCart(carts[sesid]);
	}
	return {};
}*/

(async () => {
	await dbrun("CREATE TABLE IF NOT EXISTS shop_order      (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, fe_user_id INTEGER NOT NULL, email TEXT NOT NULL, price_total DECIMAL(8,2) NOT NULL, price_taxes DECIMAL(8,2) NOT NULL, price_subtotal DECIMAL(8,2) NOT NULL);");
	await dbrun("CREATE TABLE IF NOT EXISTS shop_order_item (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, shop_order_id INTEGER NOT NULL, product_id TEXT NOT NULL, product_amount INTEGER NOT NULL, product_single_price DECIMAL(8,2) NOT NULL);");
})();
