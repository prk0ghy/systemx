import * as fesession from "./fesession.mjs";
import * as configuration from "./configuration.mjs";
const carts = {};
const getFancyCart = cart => {
	if(!cart){return getFancyCart([]);}
	for(const p in cart){
		const prod = configuration.getProduct(p);
		for(const pa in prod){
			cart[p][pa] = prod[pa];
		}
	}
	return cart;
};

const sumLists = (a,b) => {
	if(!a){return sumLists({},b);}
	for(const p in b){
		if(a[p] === undefined){
			a[p] = b[p];
		}else{
			a[p].amount += b[p].amount;
		}
	}
	return a;
};


export const empty = ctx => {
	if(ctx === undefined){return true;}
	const sesid = ctx.cookies.get(configuration.get("cartSessionCookie"));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		delete carts[sesid];
		fesession.refreshSession(ctx);
		return true;
	}
	return false;
};

export const remove = async (ctx,product) => {
	const sesid = ctx.cookies.get(configuration.get("cartSessionCookie"));
	if((sesid !== undefined) && (carts[sesid] !== undefined)){
		delete carts[sesid][product];
		await fesession.refresh(ctx);
		return true;
	}
	return false;
};

export const add = async (ctx,products) => {
	let sesid = ctx.cookies.get(configuration.get("cartSessionCookie"));
	if((sesid === undefined) || (carts[sesid] === undefined)){
		for(sesid=configuration.makeid(64);carts[sesid] !== undefined;sesid=configuration.makeid(64)){ /* Just try until we find an unused id */}
		carts[sesid] = {};
		ctx.cookies.set(configuration.get("cartSessionCookie"),sesid);
	}
	carts[sesid] = sumLists(carts[sesid],products);
	await fesession.refresh(ctx);
};

export const addSingle = async (ctx,product,amount) => {
	if(amount === undefined){
		addSingle(ctx,product,1);
		return;
	}
	const arr = {};
	arr[product] = {"amount":amount};
	await add(ctx,arr);
};

export const get = ctx => {
	const sesid = ctx.cookies.get(configuration.get("cartSessionCookie"));
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
	if(ctx.method            !== "POST")   {return;}
	if(ctx.request.body      === undefined){return;}
	if(ctx.request.body.verb === undefined){return;}
	switch(ctx.request.body.verb){
	default:
		console.warn(`Unknown post cart verb: ${ctx.request.body.verb}`);
		break;
	case "add": {
		if(ctx.request.body.product === undefined){return;}
		const product = ctx.request.body.product;
		const amount = ctx.request.body.amount ? ctx.request.body.amount | 0 : 1;
		await addSingle(ctx,product,amount);
		break; }
	case "empty":
		empty(ctx);
		break;
	case "remove": {
		if(ctx.request.body.product === undefined){return;}
		const product = ctx.request.body.product;
		await remove(ctx,product);
		break; }
	}
	ctx.body = get(ctx);
};

export const addRoutes = router => {
	router.get ("/cart",reqGetCart);
	router.post("/cart",reqPostCart);
};
