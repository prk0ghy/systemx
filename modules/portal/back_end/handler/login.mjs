import filterAdd from "../filter.mjs";
import * as User from "../user.mjs";
import * as Session from "../session.mjs";

filterAdd("login",async (v,next) => {
	if(!v.req.username){return {error: "Login action needs a username field"};}
	if(!v.req.password){return {error: "Login action needs a password field"};}
	const user = await User.tryLogin(v.req.username,v.req.password);
	if(user){
		const newSession = await Session.start(v.ctx);
		newSession.user = user;
		v.ses = newSession;
		v.res.login = true;
		v.res.user = user;
		v.res.sessionID = newSession.sessionID;
		return await next(v);
	}else {
		v.res.error = "Invalid Username/Password combination";
		return v;
	}
});
