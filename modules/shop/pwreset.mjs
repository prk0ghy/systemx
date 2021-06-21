import * as configuration from "./configuration.mjs";
import * as feuser from "./feuser.mjs";
import * as fesession from "./fesession.mjs";
import * as template from "./template.mjs";

const resetRequests = {};

const addReset = async name => {
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

export const changePage = async ctx => {
	const arr = {};
	const hash = getHash(ctx.request.path);
	arr.title  = "Passwort zur&uuml;cksetzen";
	arr.status = "";
	arr.pwresethref = configuration.prefixUrl("/pwreset");
	if(hash !== ""){
		if(resetRequests[hash] !== undefined){
			const userid = resetRequests[hash]|0;
			await fesession.start(ctx,userid);
			feuser.expirePW(userid);
			ctx.redirect(configuration.get("baseurl"));
			return;
		}else{
			arr.status = "Ihr Link konnte nicht validiert werden, bitte probieren Sie es von vorne.";
		}
	}
	if((ctx.method === "POST") && (ctx.request.body !== undefined) && (ctx.request.body.password !== undefined)){
		const user = await fesession.getUser(ctx);
		feuser.changePW(user.ID,ctx.request.body.password);
		ctx.redirect(ctx.request.originalUrl);
	}
	ctx.body = await template.renderPage("pwchange",arr,false,ctx);
};

const reqGetPWResetDo = async ctx => {
	const arr  = {};
	arr.title  = "Passwort zurücksetzen";
	arr.status = "Ihr Link konnte nicht validiert werden, bitte probieren Sie es von vorne.";
	arr.pwresethref = configuration.prefixUrl("/pwreset");
	console.log(ctx.params);

	if((ctx.params !== undefined) && (ctx.params.rid !== undefined) && (resetRequests[ctx.params.rid] !== undefined)){
		const userid = resetRequests[ctx.params.rid]|0;
		await fesession.start(ctx,userid);
		feuser.expirePW(userid);
		ctx.redirect(configuration.get("baseurl"));
		return;
	}

	ctx.body = await template.renderPage("pwreset",arr,false,ctx);
};

const reqGetPWReset = async ctx => {
	const arr  = {};
	//let hash   = getHash(ctx.request.path);
	arr.title  = "Passwort zurücksetzen";
	arr.status = "Bitte geben Sie ihren Benutzernamen ein um Ihr Passwort zurückzusetzen.";
	arr.pwresethref = configuration.prefixUrl("/pwreset");
	ctx.body = await template.renderPage("pwreset",arr,false,ctx);
};

const reqPostPWReset = async ctx => {
	const arr  = {};
	//let hash   = getHash(ctx.request.path);
	arr.title  = "Passwort zurücksetzen";
	arr.status = "Bitte geben Sie ihren Benutzernamen ein um Ihr Passwort zurückzusetzen.";
	arr.pwresethref = configuration.prefixUrl("/pwreset");

	if((ctx.method === "POST") && (ctx.request.body !== undefined) && (ctx.request.body.username !== undefined)){
		const hash = await addReset(ctx.request.body.username);
		if(hash === false){
			arr.status = "Es trat ein Fehler auf, bitte übeprüfen Sie ihre Eingabe.";
		}else{
			arr.status = "Ihnen wurde soeben eine E-Mail mit einem Link versendet über den Sie ihr Passwort zurücksetzen können.";
		}
	}
	ctx.body = await template.renderPage("pwreset",arr,false,ctx);
};

export const addRoutes = router => {
	router.get ("/pwreset/:rid", reqGetPWResetDo);
	router.get ("/pwreset/",     reqGetPWReset);
	router.get ("/pwreset",      reqGetPWReset);
	router.post("/pwreset/",     reqPostPWReset);
	router.post("/pwreset",      reqPostPWReset);
};
