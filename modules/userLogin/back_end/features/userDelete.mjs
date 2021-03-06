import * as User from "../user.mjs";
import * as Session from "../session.mjs";
import Database from "../database.mjs";
import Mail from "../../../common/mail.mjs";
import Options from "../../../common/options.mjs";
import Filter from "../filter.mjs";
import MakeID from "../../../common/randomString.mjs";

export const get = hash => Database.get(`SELECT * FROM UserDeletionRequest User WHERE hash = ?`, hash);

const add = async user => {
	console.log(`Deletion request for ${user.email}`);
	if(!user.email){return false;}
	const hash = MakeID(64);
	const row = await Database.run("INSERT INTO UserDeletionRequest (hash, user) VALUES (?, ?)", [hash, user.ID|0]);
	console.log(row);
	const values = {
		userName: user.name,
		userEmail: user.email,
		deleteLink: Options.absoluteDomain + "/delete-user/" + hash
	};
	await Mail({to: user.email, template: "userDeleteMail", values});
	return hash;
};

Filter("userDeleteRequest", async (v,next) => {
	const user = await User.getByID(v.ses?.user?.ID|0);
	console.log(user);
	if(!user){
		v.res.error = "Login first";
		return v;
	}
	delete user?.password;
	if(!user.email){
		v.res.error = "Your account needs an associated E-Mail Address so we can send you a confirmation mail.";
		return v;
	}
	v.res.userDeleteRequest = true;
	await add(user);
	return await next(v);
});

Filter("userDeleteCheck", async (v,next) => {
	const hash = v.req.deleteHash;
	v.res.deleteHashFound = Boolean(await get(hash));
	return await next(v);
});

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
});

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
