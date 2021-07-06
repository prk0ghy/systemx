import * as beuser from "./beuser.mjs";
import * as configuration from "./configuration.mjs";
const sessions = {};
export const startSession = async (ctx, user) => {
	const sesid = configuration.makeid(32);
	sessions[sesid] = {
		"ID"       : user.ID,
		"username" : user.name
	};

	ctx.cookies.set(configuration.get('beSessionCookie'),sesid);
};

export const stopSession = ctx => {
	const cookie = ctx.cookies.get(configuration.get('beSessionCookie'));
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
	const user = await beuser.tryLogin(ctx.request.body.beusername,ctx.request.body.bepassword);
	if(user === null)                             {return false;}

	await startSession(ctx,user);
	return true;
};

export const check = ctx => {
	const cookie = ctx.cookies.get(configuration.get('beSessionCookie'));
	return (cookie !== undefined) && (sessions[cookie] !== undefined);
};