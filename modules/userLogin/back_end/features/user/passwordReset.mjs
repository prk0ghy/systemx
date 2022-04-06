import * as User from "../../user.mjs";
import Database from "../../database.mjs";
import Mail from "../../../../common/mail.mjs";
import Options from "../../../../common/options.mjs";
import Filter from "../../filter.mjs";
import MakeID from "../../../../common/randomString.mjs";
import Logger from "../../logger.mjs";

export const get = hash => Database.get(`SELECT * FROM UserResetRequest WHERE hash = ?`, hash);
export const remove = hash => Database.run("DELETE FROM UserResetRequest WHERE hash = ?", hash);

const getUserPasswordResetRequests = async(userId) => {
	return await Database.all("SELECT * FROM UserResetRequest WHERE user = ?", userId);
};
const add = async user => {
	if (!user.email) {
		Logger.warn(`received password reset request for user without email: `, user);
		return false;
	}
	const hash = MakeID(64);
	const now = new Date();
	const res = now.setDate(now.getDate() + 1);
	const validUntil = new Date(res);
	await Database.run("INSERT INTO UserResetRequest (hash, user, time, validUntil) VALUES (?, ?, CURRENT_TIMESTAMP, ?)", [hash, user.ID|0, validUntil]);
	const values = {
		userName: user.name,
		userEmail: user.email,
		resetLink: `${Options.absoluteDomain}/reset-password?token=${hash}`,
		validUntil: validUntil.toLocaleString("de-DE")
	};
	await Mail({to: user.email, template: "passwordResetMail", values});
	return hash;
};

Filter("userPasswordResetRequest",async (v,next) => {
	const user = await User.getByName(String(v.req.email));
	const userPasswordResetRequests = await getUserPasswordResetRequests(user.ID);
	// expire all other requests
	for (const upr of userPasswordResetRequests) {
		await remove(upr.hash);
	}
	v.res.userPasswordResetRequest = true;
	if(!user){
		return v;
	}
	await add(user);
	return await next(v);
});

Filter("userPasswordResetCheck",async (v,next) => {
	const hash = v.req?.resetHash;
	if(!hash){
		v.res.error = "Please send a reset hash";
		return v;
	}
	const res = await get(hash);
	if (!res) {
		v.res.resetHashFound = false;
		return v;
	}
	const validDate = new Date(res.validUntil);
	const now = new Date().getDate();
	if (validDate < now) {
		v.res.error = "Password-Reset Link has expired";
		// await remove(res.hash);
		return v;
	}
	v.res.resetHashFound = Boolean(res);
	return await next(v);
});

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
});

await (async () => {
	await Database.run(`
		CREATE TABLE IF NOT EXISTS UserResetRequest (
			hash TEXT NOT NULL,
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			time DATETIME NOT NULL,
			validUntil DATETIME NOT NULL,
			PRIMARY KEY (hash)
		);
		CREATE INDEX idx_UserResetRequest_user ON UserResetRequest (hash);
	`);
})();
