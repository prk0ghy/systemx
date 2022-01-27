import DB from "./database.mjs";
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
		clear(sessionID);
	}
	ctx.cookies.set(Options.sessionCookie,'');
	return true;
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

export const set = (sessionID, value) => {
	if(!sessionID){return false;}
	if(!sessions[sessionID]){return false;}
	sessions[sessionID] = value;
	return persist(sessionID);
};

export const setCookie = (ctx, sessionID) => {
	if(!ctx || !sessionID || !sessions[sessionID]){return false;}
	ctx.cookies.set(Options.sessionCookie,sessionID);
	return true;
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
	if(sessionID && sessionID?.cookies && sessionID?.cookies?.get){ // If sessionID is actually a koa ctx, get the sessionID and continue with that
		return clear(sessionID?.cookies?.get(Options.sessionCookie));
	}
	delete sessions[sessionID];
	DB.run(`DELETE FROM UserSession WHERE ID=?;`, [sessionID]);
	return true;
};

export const persist = sessionID => {
	if(!sessionID){return false;} // Return immediatly in case of an invalid session
	if(sessionID && sessionID?.cookies){ // If sessionID is actually a koa ctx, get the sessionID and continue with that
		sessionID.cookies.clear(Options.sessionCookie);
		return persist(sessionID?.cookies.get(Options.sessionCookie));
	}
	if(!sessions[sessionID]){return false;}
	const userID = sessions[sessionID]?.user?.ID;
	if(!userID){return false;}
	try {
		const ses = {...sessions[sessionID]};
		ses.user = ses.user.ID;
		const value = JSON.stringify(ses);
		return DB.run(`INSERT INTO UserSession (ID, user, value) VALUES (?, ?, ?) ON CONFLICT(ID) DO UPDATE SET value=excluded.value;`, [sessionID, userID, value]);
	} catch(err){
		console.error(err); // Not worth crashing over
		return false;
	}
};

export const loadAll = async filters => {
	const rows = await DB.all(`SELECT * FROM UserSession;`);
	await Promise.all(rows.map(async row => {
		try {
			const ses = JSON.parse(row.value);
			if(!ses?.user){return false;}
			ses.user = await User.getByID(ses.user);
			delete ses?.user?.password;
			/* Run a fake request through userInfoGet so we get data from all activated filters,
			 * we might have also just saved everything on the sqlite database, but this approach enables
			 * us to change filters and/or fields without running into issues with stored sessions.
			 */
			const v = await filters.userInfoGet({ses, req:{}, res:ses, ctx:{}});
			sessions[row.ID] = v.ses;
			return true;

		} catch(err) {
			console.error(`Error while trying to load the session ${row.ID} of User ${row.user}`,err);
			return false;
		}
	}));
};

await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS UserSession (
			ID TEXT NOT NULL,
			user INTEGER REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			value TEXT,
			PRIMARY KEY (ID)
		);
		CREATE INDEX idx_UserSession_user ON UserSession (user);
	`);
})();

