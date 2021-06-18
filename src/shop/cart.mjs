import * as fesession from "./fesession.mjs";
import * as config from "./config.mjs";

const carts = {};

const getFancyCart = cart => {
	if(cart === undefined){cart = [];}
	for(let p in cart){
		let prod = config.getProduct(p);
		for(let pa in prod){
			if(prod.hasOwnProperty(pa)){cart[p][pa] = prod[pa];}
		}
	}
	return cart;
};

const sumLists = (a,b) => {
	if(a === undefined){a = {};}
	for(let p in b){
		if(!b.hasOwnProperty(p)){continue;}
		if(a[p] === undefined){
			a[p] = b[p];
		}else{
			a[p].amount += b[p].amount;
		}
	}
	return a;
};


export const empty = ctx => {
	if(ctx === undefined){return;}
	let sesid = ctx.cookies.get(config.get('cartSessionCookie'));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		delete carts[sesid];
		fesession.refreshSession(ctx);
		return true;
	}
	return false;
};

export const remove = async (ctx,product) => {
	let sesid = ctx.cookies.get(config.get('cartSessionCookie'));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		delete carts[sesid][product];
		await fesession.refresh(ctx);
		return true;
	}
	return false;
};

export const add = async (ctx,products) => {
	let sesid = ctx.cookies.get(config.get('cartSessionCookie'));
	if((sesid === undefined) || (carts[sesid] === undefined)){
		for(sesid=config.makeid(64);carts[sesid] !== undefined;sesid=config.makeid(64)){}
		carts[sesid] = {};
		ctx.cookies.set(config.get('cartSessionCookie'),sesid);
	}
	carts[sesid] = sumLists(carts[sesid],products);
	await fesession.refresh(ctx);
};

export const addSingle = async (ctx,product,amount) => {
	if(amount === undefined){amount = 1;}
	let arr = {};
	arr[product] = {"amount":amount};
	await add(ctx,arr);
};

export const get = ctx => {
	let sesid = ctx.cookies.get(config.get('cartSessionCookie'));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		return getFancyCart(carts[sesid]);
	}
	return {};
};

const reqGetCart = async ctx => { 
	ctx.body = get(ctx);
};

const reqPostCart = async ctx => {
	ctx.body = get(ctx);
	if(ctx.method            !== 'POST')   {return;}
	if(ctx.request.body      === undefined){return;}
	if(ctx.request.body.verb === undefined){return;}
	switch(ctx.request.body.verb){
	case 'add': {
		if(ctx.request.body.product === undefined){return;}
		let product = ctx.request.body.product;
		let amount = 1;
		if(ctx.request.body.amount === undefined){amount = ctx.request.body.amount | 0;}
		await addSingle(ctx,product,amount);
		break; }
	case 'empty':
		empty(ctx);
		break;
	case 'remove': {
		if(ctx.request.body.product === undefined){return;}
		let product = ctx.request.body.product;
		await remove(ctx,product);
		break; }
	}
	ctx.body = get(ctx);
};

export const addRoutes = router => {
	router.get ('/cart',reqGetCart);
	router.post('/cart',reqPostCart);
};