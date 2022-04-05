/* Enables the storage of various Data in association with a singular user.
 * Since we automatically convert from/to JSON we can store values of various
 * types, not just strings.
 */
import DB from "../../database.mjs";
import fs from "fs";
import filterAdd from "../../filter.mjs";
import * as User from "../../user.mjs";

export const getAll = async userID => {
	const rows = await DB.all(`SELECT key,value FROM UserMeta WHERE user = ?`, userID);
	const ret = {};
	for(const row of rows){
		ret[row.key] = JSON.parse(row.value);
	}
	return ret;
};

export const getSingle = async (userID, key) => {
	const row = await DB.get(`SELECT value FROM UserMeta WHERE user = ? AND key = ?`, userID, key);
	return row ? JSON.parse(String(row.value)) : null;
};

export const set = async (userID, key, value) => {
	await DB.run("INSERT OR REPLACE INTO UserMeta (user, key, value) VALUES (?, ?, ?)", [userID, key, JSON.stringify(value)]);
};

export const setMany = async (userID, values) => {
	if(!values){return;}
	for(const key in values){
		await set(userID, key, values[key]);
	}
};

/* Not really all that useful, mostly used so we actually make use of the
 * imported user module, which is necessary so we get the right initialization order
 */
export const getUserAndMeta = async userID => {
	const user = await User.getByID(userID);
	const meta = await getAll(userID);
	return {...user,meta};
};

const filterMetadataGet = async (v,next) => {
	v.ses.user.meta = v.res.user.meta = await getAll(v.res.user.ID);
	return await next(v);
};
/* Add all metadata to each userinfo/login action */
filterAdd("userInfoGet", filterMetadataGet, 10);
filterAdd("userLogin", filterMetadataGet, 10);

/* Enable passing a `meta` value on to the userRegistration filter which can be used for
 * adding the country or if the user is a business customer.
 */
filterAdd("userRegister",async (v,next) => {
	if (v.req.meta) {
		await setMany(v.res.userID,v.req.meta);
	}
	return await next(v);
},10);

filterAdd("userMetaGet",async (v,next) => {
	if(!v.req?.key){
		v.res.error = "You have to provide a key";
		return v;
	}
	if(!v.ses?.user?.ID){
		v.res.error = "Kinda hard to get user metadata without first logging in";
		return v;
	}
	v.res.key = v.req.key;
	v.res.value = await getSingle(v.ses.user.ID,v.req.key);
	return await next(v);
});

filterAdd("userMetaSet",async (v,next) => {
	if(!v.req?.key){
		v.res.error = "You have to provide a key";
		return v;
	}
	if(!v.ses?.user?.ID){
		v.res.error = "Kinda hard to set user metadata without first logging in";
		return v;
	}
	await set(v.ses.user.ID,v.req.key,v.req.value);
	v.res.key = v.req.key;
	v.res.value = await getSingle(v.ses.user.ID,v.req.key);
	v.res.set = true;
	return await next(v);
});

/* Here we load the default user file and set all the associated metadata
 * since we depend on the user file this should only evaluate after the
 * user table has been properly initialized, so we don't run into issues
 * with the constraints.
 */
await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS UserMeta(
			user INTEGER REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			key TEXT NOT NULL,
			value TEXT,
			PRIMARY KEY (user, key)
		);
		CREATE INDEX idx_UserMeta_user ON UserMeta (user);
	`);
	const data = await fs.promises.readFile("./data/user.json");
	const rows = JSON.parse(data.toString());
	await Promise.all(rows.map(async row => {
		if(!row.meta){ return; }
		const user = await User.getByName(row.name);
		if (!user) { return; }
		for(const metakey in row.meta){
			await set(user.ID,metakey,row.meta[metakey]);
		}
	}));
})();

