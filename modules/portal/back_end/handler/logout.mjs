import * as Session from "../session.mjs";

const handle = async (ctx, req, session) => {
	if(session?.sessionID){
		Session.stop(ctx,session.sessionID);
	}
	return {
		response: {
			error: false,
			logout: true
		},
		session: {}
	};
};
export default handle;
