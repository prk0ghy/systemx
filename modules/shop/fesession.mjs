import * as cart from "./cart.mjs";
import * as configuration from "./configuration.mjs";
import * as feuser from "./feuser.mjs";

const sessions = {};

export const stop = ctx => {
	const cookie = ctx.cookies.get(configuration.get('feSessionCookie'));
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		delete sessions[cookie];
		return true;
	}
	cart.empty();
	return false;
};

export const refresh = async (ctx, sesid) => {
	const id = sesid === undefined ? ctx.cookies.get(configuration.get('feSessionCookie')) : sesid;
	if((id === undefined) || (sessions[id] === undefined)){return;}
	const userid = sessions[id].ID|0;
	const user = await feuser.getByID(userid);

	sessions[id] = {
		"ID"       : user.ID,
		"username" : user.name,
		"email"    : user.email,
		"cart"     : cart.get(ctx),
		"products" : await feuser.getActiveProducts(user.ID)
	};
	console.log('Refreshed Session');
	console.log(sessions[id]);
};

export const start = async (ctx,userid) => {
	const user  = await feuser.getByID(userid);
	if(user === undefined){return;}
	let sesid = configuration.makeid(64);
	while(sessions[sesid] !== undefined){sesid=configuration.makeid(64);}
	sessions[sesid] = {"ID" : user.ID};
	await refresh(ctx,sesid);
	ctx.cookies.set(configuration.get('feSessionCookie'),sesid);
};

export const get = ctx => {
	if(ctx === undefined){return undefined;}
	const cookie = ctx.cookies.get(configuration.get('feSessionCookie'));
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		return sessions[cookie];
	}
	return undefined;
};

export const getUser = ctx => {
	const session = get(ctx);
	if(session    === undefined){return undefined;}
	if(session.ID === undefined){return undefined;}
	return feuser.getByID(session.ID);
};

export const checkPassword = async ctx => {
	if(ctx.method !== 'POST')                   {return false;}
	if(ctx.request.body === undefined)          {return false;}
	if(ctx.request.body.username === undefined) {return false;}
	if(ctx.request.body.password === undefined) {return false;}
	const user = await feuser.tryLogin(ctx.request.body.username,ctx.request.body.password);
	if(user === null)                           {return false;}
	await start(ctx,user.ID);

	return true;
};

export const check = ctx => {
	const cookie = ctx.cookies.get(configuration.get('feSessionCookie'));
	return (cookie !== undefined) && (sessions[cookie] !== undefined);
};

const reqLogout = async ctx => {
	console.log("reqLogout");
	stop(ctx);
	ctx.redirect(configuration.get('baseurl'));
};

export const addRoutes = router => {
	router.all ('/logout', reqLogout);
};
