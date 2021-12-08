import filterAdd from "../filter.mjs";
import * as Session from "../session.mjs";

filterAdd("userLogout",async (v,next) => {
	if(v.ses?.sessionID){
		Session.stop(v.ctx,v.ses.sessionID);
	}
	v.res.logout = true;
	v.ses = {};
	return await next(v);
});
