import MakeID from "../../common/randomString.mjs";
import * as configuration from "./OLD/configuration.mjs";
import * as User from "./user.mjs";

const sessions = {};

export const stop = (ctx,sessionID) => {
	if(sessions[sessionID] !== undefined){
		delete sessions[sessionID];
		ctx.cookies.set(configuration.get('sessionCookie'),'');
		return true;
	}
	//cart.empty();
	return false;
};

export const start = ctx => {
	let sessionID = MakeID(64);
	while(sessions[sessionID] !== undefined){sessionID=MakeID(64);}
	sessions[sessionID] = {sessionID};
	ctx.cookies.set(configuration.get('sessionCookie'),sessionID);
	return sessions[sessionID];
};

export const get = ctx => {
	if(ctx === undefined){return undefined;}
	const cookie = ctx.cookies.get(configuration.get('sessionCookie'));
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		return sessions[cookie];
	}
	return undefined;
};

export const getByID = ID => sessions[ID] || {};

export const set = (ctx, session) => {
	if(ctx === undefined){return;}
	const cookie = ctx.cookies.get(configuration.get('sessionCookie'));
	if(typeof session === "string"){
		console.trace();
	}
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		sessions[cookie] = session;
	}
};

export const getUser = ctx => {
	const session = get(ctx);
	return User.getByID(session?.user?.ID);
};

export const check = ctx => {
	const cookie = ctx.cookies.get(configuration.get('sessionCookie'));
	return (cookie !== undefined) && (sessions[cookie] !== undefined);
};
