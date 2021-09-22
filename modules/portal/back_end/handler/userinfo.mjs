import filterAdd from "../filter.mjs";
import * as User from "../user.mjs";

filterAdd("userInfoGet",async (v,next) => {
	const user = await User.getByID(v.ses?.user?.ID|0);
	delete user?.password;
	if(!user){
		v.res.error = "Session not found";
		return v;
	}
	v.res.user = user;
	return await next(v);
});
