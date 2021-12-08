import * as User from "../user.mjs";
import Mail from "../../../common/mail.mjs";
import Options from "../../../common/options.mjs";
import Filter from "../filter.mjs";
import MakeID from "../../../common/randomString.mjs";

const resetRequests = {};

const add = async user => {
	if(!user.email){return false;}
	const hash = MakeID(64);
	resetRequests[hash] = user.ID|0;
	const values = {
		userName: user.name,
		userEmail: user.email,
		resetLink: Options.absoluteDomain + "/userPasswordReset/" + hash
	};
	await Mail({to: user.email, template: "passwordResetMail", values});
	return hash;
};

Filter("userPasswordResetRequest",async (v,next) => {
	const user = await User.getByName(String(v.req.username));
	v.res.userPasswordResetRequest = true;
	if(!user){
		return v;
	}
	await add(user);
	return await next(v);
});

Filter("userPasswordResetCheck",async (v,next) => {
	const hash = v.req.resetHash;
	v.res.resetHashFound = resetRequests[hash] !== undefined;
	return await next(v);
});

Filter("userPasswordResetSubmit",async (v,next) => {
	const hash = v.req.resetHash;
	const pw = v.req.newPassword;
	const userID = resetRequests[hash];
	if(!userID){
		v.res.error = "Couldn't find resetHash";
		return v;
	}
	delete resetRequests[hash];
	await User.changePassword(userID,pw);
	v.res.userPasswordResetSubmit = true;
	return await next(v);
});
