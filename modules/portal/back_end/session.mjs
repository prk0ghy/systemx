import MakeID from "../../common/randomString.mjs";
import Options from "../../common/options.mjs";
import * as User from "./user.mjs";

const sessions = {};

/* Stops the session associated with the Koa ctx */
export const stop = (ctx,sessionID) => {
	if(!sessionID){
		const cookie = ctx.cookies.get(Options.sessionCookie);
		if(cookie){ return stop(ctx,cookie); }
	}
	if(sessions[sessionID] !== undefined){
		delete sessions[sessionID];
		ctx.cookies.set(Options.sessionCookie,'');
		return true;
	}
	return false;
};

/* Get a new, unique, session ID */
const getSessionID = () => {
	for(let i=0;i<32;i++){ // Should be unique after 32 tries, otherwise there is something wrong with MakeID
		const sessionID = MakeID(64);
		if(sessions[sessionID] === undefined){return sessionID;}
	}
	console.log("Error creating session ID");
	return null;
};

export const start = ctx => {
	const sessionID = getSessionID();
	sessions[sessionID] = {sessionID};
	ctx.cookies.set(Options.sessionCookie,sessionID);
	return sessions[sessionID];
};

export const get = ctx => {
	if(ctx === undefined){return undefined;}
	const cookie = ctx.cookies.get(Options.sessionCookie);
	if((cookie !== undefined) && (sessions[cookie] !== undefined)){
		return sessions[cookie];
	}
	return undefined;
};

export const getByID = ID => sessions[ID] || {};

export const set = (ctx, session) => {
	if(ctx === undefined){return;}
	const cookie = ctx.cookies.get(Options.sessionCookie);
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
	const cookie = ctx.cookies.get(Options.sessionCookie);
	return (cookie !== undefined) && (sessions[cookie] !== undefined);
};

export const clear = sessionID => {
	if(!sessionID){return false;} // Return immediatly in case of an invalid session
	if(sessionID && sessionID?.cookies){ // If sessionID is actually a koa ctx, get the sessionID and continue with that
		sessionID.cookies.clear(Options.sessionCookie);
		return clear(sessionID?.cookies.get(Options.sessionCookie));
	}
	delete sessions[sessionID];
	return true;
};
