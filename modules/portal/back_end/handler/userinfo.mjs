import filterAdd from "../filter.mjs";
import * as User from "../user.mjs";

filterAdd("userinfo",async (v,next) => {
	v.res.user = await User.getByID(v.ctx.ses?.user?.ID|0);
	if(!v.res.user){
		v.res.error = "Session not  found";
		return v;
	}
	return await next(v);
});
