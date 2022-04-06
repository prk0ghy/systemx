import filterAdd from "../../filter.mjs";
import Options from "systemx-common/options.mjs";
import * as User from "../../user.mjs";
import sendMail from "systemx-common/mail.mjs";
import MakeID from "systemx-common/randomString.mjs";
import Database from "../../database.mjs";
import config from "../../config.mjs";
import logger from "../../logger.mjs";
import {remove} from "../../user.mjs";

filterAdd("userRegister",async (v,next) => {
	if (!v.req.username) {
		v.res.error = "A username is quite important considering you might wanna login later.";
		return v;
	}
	if (v.req.username.length < 3) {
		v.res.error = "Your username needs to consist of at least 3 letters.";
		return v;
	}
	const duplicateUser = await User.getByName(v.req.username);
	if (duplicateUser) {
		v.res.error = "A user going by the provided name is already in our database.";
		return v;
	}
	if (!v.req.password) {
		v.res.error = "Passwords are necessary.";
		return v;
	}
	if (v.req.password.length < 8) {
		v.res.error = "Your password needs to consist of at least 8 letters.";
		return v;
	}
	if (Options.portalRegisterEmailRequired) {
		if (!v.req.email) {
			v.res.error = "You need an E-Mail Address.";
			return v;
		}
	}
	const newUserID = await User.add(v.req.username, v.req.email, v.req.password, false);
	const newUser = await User.getByID(newUserID);
	try {
		await addPendingActivation(newUser);
	} catch (error) {
		v.res.error = "Failed to send Activation Email";
		User.remove(newUser.ID);
		logger.error(error.message);
		return v;
	}
	v.res.userID = newUserID;
	v.res.username = v.req.username;
	v.res.userRegister = true;
	return await next(v);
});

const getActivation = hash => Database.get("SELECT * FROM UserActivation WHERE hash = ?", hash);
const deleteActivation = hash => Database.run("DELETE FROM UserActivation WHERE hash = ?", hash);

const getUserActivationRequests = async(userId) => {
	return await Database.all("SELECT * FROM UserActivation WHERE user = ?", userId);
};

filterAdd("userActivationCheck", async(v, next) => {
	const hash = v.req?.hash;
	if (!hash) {
		v.res.error = "No hash provided";
		return v;
	}
	const res = await getActivation(hash);
	if (!res) {
		v.res.activationHashFound = false;
		return v;
	}
	const validDate = new Date(res.validUntil);
	const now = new Date().getDate();
	if (validDate < now) {
		v.res.error = "Activation Link has expired";
		await deleteActivation(res.hash);
		await remove(res.user);
		return v;
	}
	v.res.activationHashFound = Boolean(res);
	return await next(v);
});

filterAdd("userActivationSubmit", async(v, next) => {
	const hash = v.req.activationHash;
	const { user: userID } = await getActivation(hash);
	if (!userID) {
		v.res.error = "Could not find activationHash";
		return v;
	}
	await User.setIsActivated(userID, true);
	await deleteActivation(hash);
	v.res.userActivated = true;
	return await next(v);
});

filterAdd("userActivationResend", async(v, next) => {
	const activationRequests = await getUserActivationRequests(v.ses.user.ID);
	for (const req of activationRequests) {
		await deleteActivation(req.hash);
	}
	await addPendingActivation(v.ses.user);
	return await next(v);
});


const addPendingActivation = async(user) => {
	if (!user.email) {
		return false;
	}
	const hash = MakeID(64);
	const values = {
		email: user.name,
		activationLink: `${config.userLogin.domain}/activate?token=${hash}`
	};
	const now = new Date();
	const res = now.setDate(now.getDate() + 1);
	const validUntil = new Date(res);
	values.validUntil = validUntil.toLocaleString("de-DE");
	await Database.run(
		"INSERT INTO UserActivation (hash, user, time, validUntil) VALUES (?, ?, CURRENT_TIMESTAMP, ?)", [hash, user.ID, validUntil]
	);
	await sendMail({
		to: user.email,
		template: "userActivation",
		values
	});
	return true;
};

await (async () => {
	await Database.run(`
		CREATE TABLE IF NOT EXISTS UserActivation (
			hash TEXT NOT NULL,
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			time DATETIME NOT NULL,
			validUntil DATETIME NOT NULL,
			PRIMARY KEY (hash)
		);
		CREATE INDEX idx_UserActivation_user ON UserActivation (hash);
	`);
})();
