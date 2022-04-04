import * as User from "../../user.mjs";
import Database from "../../database.mjs";
import Mail from "systemx-common/mail.mjs";
import Options from "systemx-common/options.mjs";
import Filter from "../../filter.mjs";
import MakeID from "systemx-common/randomString.mjs";
import Logger from "../../logger.mjs";

export const get = hash => Database.get(`SELECT * FROM UserResetRequest WHERE hash = ?`, hash);
export const remove = hash => Database.run("DELETE FROM UserResetRequest WHERE hash = ?", hash);

const add = async user => {
	if (!user.email) {
		Logger.warn(`received password reset request for user without email: `, user);
		return false;
	}
	const hash = MakeID(64);
	await Database.run("INSERT INTO UserResetRequest (hash, user, time) VALUES (?, ?, CURRENT_TIMESTAMP)", [hash, user.ID|0]);
	const values = {
		userName: user.name,
		userEmail: user.email,
		resetLink: Options.absoluteDomain + "/reset-password?token=" + hash
	};
	await Mail({to: user.email, template: "passwordResetMail", values});
	return hash;
};

Filter("userPasswordResetRequest",async (v,next) => {
	const user = await User.getByName(String(v.req.email));
	v.res.userPasswordResetRequest = true;
	if(!user){
		return v;
	}
	await add(user);
	return await next(v);
}, 0, { requiresActivation: true});

Filter("userPasswordResetCheck",async (v,next) => {
	const hash = v.req?.resetHash;
	if(!hash){
		v.res.error = "Please send a reset hash";
		return v;
	}
	const res = await get(hash);
	v.res.resetHashFound = Boolean(res);
	return await next(v);
}, 0, { requiresActivation: true});

Filter("userPasswordResetSubmit",async (v,next) => {
	const hash = v.req.resetHash;
	const pw = v.req.newPassword;
	const { user } = await get(hash);
	if(!user){
		v.res.error = "Couldn't find resetHash";
		return v;
	}
	await User.changePassword(user,pw);
	await remove(hash);
	v.res.userPasswordResetSubmit = true;
	return await next(v);
}, 0, { requiresActivation: true});

await (async () => {
	await Database.run(`
		CREATE TABLE IF NOT EXISTS UserResetRequest (
			hash TEXT NOT NULL,
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			time DATETIME NOT NULL,
			PRIMARY KEY (hash)
		);
		CREATE INDEX idx_UserResetRequest_user ON UserResetRequest (hash);
	`);
})();
