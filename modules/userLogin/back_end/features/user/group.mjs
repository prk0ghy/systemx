/* Used for associating Users to groups, which are mostly used for
 * granting access to certain contents, or maybe change the way
 * certain content is displayed (Student/Teacher). Might also be bought
 * directly when content is behind a Paywall.
 */
import * as User from "../../user.mjs";
import database from "../../database.mjs";
import filterAdd from "../../filter.mjs";
import fs from "fs";

/* Get all Groups associated to a certain userID */
export const get = async userID => {
	const rows = await database.all(`SELECT name FROM UserGrouping WHERE user = ?`, [userID|0]);
	if (!rows) {
		return {};
	}
	const ret = {};
	for (const row of rows) {
		ret[row.name] = row.name;
	}
	return ret;
};

/* Associate one or many groups to a certain userID */
export const add = async (userID, groups) => {
	if(!groups){ return; }
	if(groups && Array.isArray(groups)){
		await Promise.all(groups.map(group => add(userID,group)));
		return;
	}
	const group = String(groups);
	await database.run("INSERT OR REPLACE INTO UserGrouping (user, name) VALUES (?, ?)", [userID, group]);
};

/* Disassociate one or many groups from a userID */
export const remove = async (userID, groups) => {
	if(!groups){ return; }
	if(groups && Array.isArray(groups)){
		await Promise.all(groups.map(group => remove(userID,group)));
		return;
	}
	const group = String(groups);
	await database.run("REMOVE FROM UserGrouping WHERE user = ? AND name = ?", [userID, group]);
};

/* By adding the groups to the session enables us to check the group of each session withouth
 * doing a DB query, which will become quite important once every request has to be tunneled
 * through the fileserver with a permission check.
 */
const filterUserGroupGet = async (v,next) => {
	if(!v?.res?.user?.ID){return await next(v);}
	v.ses.user.groups = v.res.user.groups = await get(v.res.user.ID);
	return await next(v);
};
/* Add all metadata to each userinfo/login action */
filterAdd("userInfoGet",filterUserGroupGet,5);
filterAdd("userLogin",filterUserGroupGet,5);

/* Just the usual DB initialization coupled with adding default values, as per usual it is
 * quite important that we import the user module first, to ensure the proper order.
 */
await (async () => {
	await database.run(`
		CREATE TABLE IF NOT EXISTS UserGrouping (
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			name TEXT NOT NULL,
			PRIMARY KEY (user, name)
		);
		CREATE INDEX idx_UserGrouping_user ON UserGrouping (user);
	`);
	const data = await fs.promises.readFile("./data/user.json");
	const rows = JSON.parse(data.toString());
	rows.forEach(async row => {
		const user = await User.getByName(row.name);
		if (!user) { return; }
		const userID = user.ID|0;
		await add(userID, row.groups);
	});
})();
