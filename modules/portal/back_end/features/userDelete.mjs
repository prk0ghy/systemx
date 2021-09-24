import * as User from "../user.mjs";
import Mail from "../../../common/mail.mjs";
import Options from "../../../common/options.mjs";
import Filter from "../filter.mjs";
import MakeID from "../../../common/randomString.mjs";

const deleteRequests = {};

const add = async user => {
	if(!user.email){return v;}
	const hash = MakeID(64);
	deleteRequests[hash] = user.ID|0;
	const values = {
		userName: user.name,
		userEmail: user.email,
		deleteLink: Options.absoluteDomain + "/userDelete/" + hash
	};
	await Mail({to: user.email, template: "userDeleteMail", values});
	return hash;
};

Filter("userDeleteRequest",async (v,next) => {
    const user = await User.getByID(v.ses?.user?.ID|0);
	delete user?.password;
	if(!user){
		v.res.error = "Login first";
		return v;
	}
    if(!user.email){
        v.res.error = "Your account needs an associated E-Mail Address so we can send you a confirmation mail."
        return v;
    }
	v.res.userDeleteRequest = true;
	await add(user);
	return await next(v);
});

Filter("userDeleteCheck",async (v,next) => {
	const hash = v.req.deleteHash;
	v.res.deleteHashFound = deleteRequests[hash] !== undefined;
	return await next(v);
});

Filter("userDeleteSubmit",async (v,next) => {
	const hash = v.req.deleteHash;
	const userID = deleteRequests[hash];
	if(!userID){
		v.res.error = "Couldn't find deleteHash";
		return v;
	}
    if(userID !== v.ses?.user?.ID|0){
		v.res.error = "Please login first";
		return v;
	}
	delete deleteRequests[hash]
	await User.remove(userID);
	v.res.userDeleteSubmit = true;
    sessionStorage.clear(ctx,v.ses.sessionID);
    v.ses = {};
	return await next(v);
});
