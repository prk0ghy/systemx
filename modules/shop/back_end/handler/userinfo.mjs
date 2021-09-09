import * as User from "../user.mjs";

const handle = async (ctx, req, session) => {
	const user = await User.getByID(session?.user?.ID|0);
	return {
		response: {
			error: !user && "Session not found",
			user
		},
		session
	};
};
export default handle;
