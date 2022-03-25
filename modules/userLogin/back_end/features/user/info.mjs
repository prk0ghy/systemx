import Filter from "../../filter.mjs";
import * as User from "../../user.mjs";
Filter("userInfoGet", async (v, next) => {
	const user = await User.getByID(v.ses?.user?.ID | 0);
	if (!user){
		v.res.error = "Session not found";
		return v;
	}
	v.res.user = user;
	return await next(v);
});
Filter("userInfoSet", async (v, next) => {
	const user = await User.getByID(v.ses?.user?.ID | 0);
	if(!user){
		v.res.error = "Login first";
		return v;
	}
	v.res.user = {};
	for (const key in v.req?.user){
		if (!v.req.user[key]){
			v.res.user[key] = false;
			continue;
		}
		switch(key){
		default:
			v.res.user[key] = false;
			break;
		case "email":
			await User.changeEmail(user.ID,v.req.user[key]);
			break;
		case "password":
			await User.changePassword(user.ID,v.req.user[key]);
			v.res.user[key] = v.req.user[key];
			break;
		}
	}
	return await next(v);
}, 0, { requiresActivation: true});
