import * as User from "../user.mjs";
import * as Session from "../session.mjs";

const handle = async (ctx, req, session) => {
	if(!req.username){return {error: "Login action needs a username field"};}
	if(!req.password){return {error: "Login action needs a password field"};}
	const user = await User.tryLogin(req.username,req.password);
	if(user){
		const newSession = await Session.start(ctx);
		newSession.user = user;
		return {
			response: {
				error: false,
				user
			},
			session: newSession
		};
	}else {
		return {
			response: {
				error: "Invalid Username/Password combination",
				user
			},
			session
		};
	}

};
export default handle;
