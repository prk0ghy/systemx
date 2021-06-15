import * as cart from "./cart.mjs";
import * as feuser from "./feuser.mjs";
import * as config from "./config.mjs";

const sessions = {};

export const stop = ctx => {
	let cookie = ctx.cookies.get(config.get('feSessionCookie'));
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		delete sessions[cookie];
		return true;
	}
	cart.empty();
	return false;
}

export const refresh = async (ctx, sesid) => {
	if(sesid === undefined){ sesid = ctx.cookies.get(config.get('feSessionCookie')); }
	if((sesid === undefined) || (sessions[sesid] === undefined)){return;}
	const userid = sessions[sesid].ID|0;
	let user = await feuser.getByID(userid)

	sessions[sesid] = {
		"ID"       : user.ID,
		"username" : user.name,
		"email"    : user.email,
		"cart"     : cart.get(ctx),
		"products" : await feuser.getActiveProds(user.ID)
	};
	console.log('Refreshed Session');
	console.log(sessions[sesid]);
}

export const start = async (ctx,userid) => {
	let user  = await feuser.getByID(userid)
	if(user === undefined){return;}
	let sesid = config.makeid(64);
	while(sessions[sesid] !== undefined){sesid=config.makeid(64);}
	sessions[sesid] = {"ID" : user.ID};
	await refresh(ctx,sesid);
	ctx.cookies.set(config.get('feSessionCookie'),sesid);
}

export const get = ctx => {
	if(ctx === undefined){return undefined;}
	let cookie = ctx.cookies.get(config.get('feSessionCookie'));
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		return sessions[cookie];
	}
	return undefined;
}

export const getUser = ctx => {
	let session = get(ctx);
	if(session    === undefined){return undefined;}
	if(session.ID === undefined){return undefined;}
	return feuser.getByID(session.ID);
}

export const checkPassword = async ctx => {
	if(ctx.method !== 'POST')                   {return false;}
	if(ctx.request.body === undefined)          {return false;}
	if(ctx.request.body.username === undefined) {return false;}
	if(ctx.request.body.password === undefined) {return false;}
	let user = await feuser.tryLogin(ctx.request.body.username,ctx.request.body.password);
	if(user === null)                           {return false;}
	await start(ctx,user.ID);

	return true;
}

export const check = ctx => {
	let cookie = ctx.cookies.get(config.get('feSessionCookie'));
	return (cookie !== undefined) && (sessions[cookie] !== undefined);
}

const reqLogout = async ctx => {
	console.log("reqLogout");
	stop(ctx);
	ctx.redirect(config.get('baseurl'));
}

export const addRoutes = router => {
	router.all ('/logout', reqLogout);
}