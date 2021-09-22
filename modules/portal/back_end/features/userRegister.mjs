import filterAdd from "../filter.mjs";
import Options from "../../../common/options.mjs";
import * as User from "../user.mjs";

filterAdd("userRegister",async (v,next) => {
	if(!v.req.username){
		v.res.error = "A username is quite important considering you might wanna login later.";
		return v;
	}
	if(v.req.username.length < 3){
		v.res.error = "Your username needs to consist of at least 3 letters.";
		return v;
	}
	if(!v.req.password){
		v.res.error = "Passwords are necessary.";
		return v;
	}
	if(v.req.password.length < 8){
		v.res.error = "Your password needs to consist of at least 8 letters.";
		return v;
	}
	if(Options.portalRegisterEmailRequired){
		if(!v.req.email){
			v.res.error = "You need an E-Mail Address.";
			return v;
		}
		/* Here we might switch over to sending an E-Mail with an activation link to make
		 * sure the user actually has access to the Address provided. Also validating that
		 * the string provided is actually an E-Mail address would be good.
		 */
	}
	const duplicateUser = await User.getByName(v.req.username);
	if(duplicateUser){
		v.res.error = "A user going by the provided name is already in our database.";
		return v;
	}
	const newUser = await User.add(v.req.username, v.req.email, v.req.password);
	v.res.userID = newUser;
	v.res.username = v.req.username;
	v.res.userRegister = true;
	return await next(v);
});
