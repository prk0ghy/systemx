import * as beuser from "./beuser.mjs";
import * as config from "./config.mjs";

const sessions = {};

export const startSession = async (ctx, user) => {
	let sesid = config.makeid(32);
	sessions[sesid] = {
		"ID"       : user.ID,
		"username" : user.name
	};

	ctx.cookies.set(config.get('beSessionCookie'),sesid);
};

export const stopSession = ctx => {
	let cookie = ctx.cookies.get(config.get('beSessionCookie'));
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		delete sessions[cookie];
		return true;
	}
	return false;
};

export const checkPassword = async ctx => {
	if(ctx.method !== 'POST')                     {return false;}
	if(ctx.request.body === undefined)            {return false;}
	if(ctx.request.body.beusername === undefined) {return false;}
	if(ctx.request.body.bepassword === undefined) {return false;}
	let user = await beuser.tryLogin(ctx.request.body.beusername,ctx.request.body.bepassword);
	if(user === null)                             {return false;}

	await startSession(ctx,user);
	return true;
};

export const check = ctx => {
	let cookie = ctx.cookies.get(config.get('beSessionCookie'));
	return (cookie !== undefined) && (sessions[cookie] !== undefined);
};
