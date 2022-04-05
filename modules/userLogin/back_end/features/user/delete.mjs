import * as User from "../../user.mjs";
import * as Session from "../../session.mjs";
import Database from "../../database.mjs";
import Mail from "systemx-common/mail.mjs";
import Filter from "../../filter.mjs";
import MakeID from "systemx-common/randomString.mjs";
import Logger from "../../logger.mjs";
import config from "../../config.mjs";

export const get = hash => Database.get(`SELECT * FROM UserDeletionRequest WHERE hash = ?`, hash);

const add = async user => {
	Logger.debug(`user delete request from: ${user.email}`);
	if (!user.email) {
		Logger.warn(`user has no email: `, user);
		return false;
	}
	const hash = MakeID(64);
	await Database.run("INSERT INTO UserDeletionRequest (hash, user) VALUES (?, ?)", [hash, user.ID|0]);
	const values = {
		userName: user.name,
		userEmail: user.email,
		deleteLink: config.userLogin.domain + "/delete-user?token=" + hash
	};
	await Mail({to: user.email, template: "userDeleteMail", values});
	return hash;
};

Filter("userDeleteRequest", async (v,next) => {
	const user = await User.getByID(v.ses?.user?.ID|0);
	if(!user){
		v.res.error = "Login first";
		return v;
	}
	if(!user.email){
		v.res.error = "Your account needs an associated E-Mail Address so we can send you a confirmation mail.";
		return v;
	}
	v.res.userDeleteRequest = true;
	await add(user);
	return await next(v);
},0, { requiresActivation: true});

Filter("userDeleteCheck", async (v,next) => {
	const hash = v.req.deleteHash;
	v.res.deleteHashFound = Boolean(await get(hash));
	return await next(v);
}, 0, { requiresActivation: true});

Filter("userDeleteSubmit", async (v,next) => {
	const hash = v.req.deleteHash;
	const { user } = await get(hash);
	if(!user){
		v.res.error = "Couldn't find deleteHash";
		return v;
	}
	if(user !== v.ses?.user?.ID|0){
		v.res.error = "Please login first";
		return v;
	}

	await User.remove(user);
	v.res.userDeleteSubmit = true;
	Session.clear(v.ctx);
	Session.clear(v.ses.sessionID);
	v.ses = {};
	return await next(v);
}, 0, { requiresActivation: true});

await (async () => {
	await Database.run(`
		CREATE TABLE IF NOT EXISTS UserDeletionRequest (
			hash TEXT NOT NULL,
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			PRIMARY KEY (hash)
		);
		CREATE INDEX idx_UserDeletionRequest_user ON UserDeletionRequest (hash);
	`);
})();
