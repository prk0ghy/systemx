import * as configuration from "./configuration.mjs";
import * as feuser from "./user.mjs";
import * as fesession from "./session.mjs";

const resetRequests = {};

export const addReset = async name => {
	const user = await feuser.getByName(name.trim());
	if(user === undefined){return false;}
	const hash = configuration.makeid(32);
	resetRequests[hash] = user.ID|0;
	const resetLink = configuration.absoluteUrl("/pwreset/"+hash);
	const mailText = "Um Ihr Passwort zurueckzusetzen besuchen Sie bitte folgenden Link: "+resetLink;
	//let mailHtml = "<h3>Passwort Zuruecksetzen</h3><p>Um Ihr Passwort zurueckzusetzen benutzen Sie bitte folgenden Link: <a href=""+resetLink+"">"+resetLink+"</a></p>";
	//mail.send("proexly@proexly-test.de",user.email,"Passwort Zuruecksetzen",mailText,mailHtml);
	console.log(mailText);
	return true;
};

const getHash = path => {
	const prefix = configuration.prefixUrl("/pwreset");
	const ppath  = path.substr(0,prefix.length).trim();
	if(prefix !== ppath){return false;}
	if(path[prefix.length] !== "/"){return "";}
	return path.substr(prefix.length+1);
};

export const checkReset = ctx => {
	const hash = getHash(ctx.request.path);
	return hash !== false;
};

export const changeCheck = async ctx => {
	const user = await fesession.getUser(ctx);
	if(user === undefined){return false;}
	return user.passwordExpired === 1;
};
