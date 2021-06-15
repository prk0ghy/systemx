import * as config from "./config.mjs";
import * as feuser from "./feuser.mjs";
import * as fesession from "./fesession.mjs";
import * as pwreset from "./pwreset.mjs";
import * as shop from "./shop.mjs";
import * as template from "./template.mjs";

let resetRequests = {};

const getDeletionHash = path => {
	let prefix = config.prefixUrl('/userDelete');
	let ppath  = path.substr(0,prefix.length).trim();
	if(prefix !== ppath){return false;}
	if(path[prefix.length] !== '/'){return '';}
	return path.substr(prefix.length+1);
};

const addDeletionRequest = async id => {
	let user = await feuser.getUserByID(id);
	if(user === undefined){return false;}
	let hash = config.makeid(32);
	resetRequests[hash] = user.ID|0;
	let delLink = config.absoluteUrl('/userDelete/'+hash);
	let mailText = 'Um Ihren Account unwiederruflich zu löschen, besuchen Sie bitte folgenden Link: '+delLink;
	//let mailHtml = '<h3>Passwort Löschen</h3><p>Um Ihren Account unwiederruflich zu löschen, besuchen Sie bitte folgenden Link: <a href="'+delLink+'">'+delLink+'</a></p>';
	//mail.send("proexly@proexly-test.de",user.email,"Passwort Zuruecksetzen",mailText,mailHtml);
	console.log(mailText);
	return true;
};

export const reqLogin = async ctx => {
	let arr = {};
	arr.title  = 'Login'
	arr.status = 'Bitte gib deine Zugangsdaten ein.';
	arr.pwresethref = config.prefixUrl('/pwreset');
	arr.loginhref = config.absoluteUrl('/login');
	if((ctx.method === 'POST') && (ctx.request.body !== undefined) && (ctx.request.body.username !== undefined)){
		arr.status = 'Passwort ungueltig, bitte versuche es erneut!';
	}
	ctx.body = await template.renderPage('login',arr,false,ctx);
};

export const checkUserDelete = async ctx => getDeletionHash(ctx.request.path) !== false;

export const checkUserSettings = async ctx => {
	let prefix  = config.prefixUrl('/userSettings');
	let ppath   = ctx.request.path.substr(0,prefix.length).trim();
	let sprefix = prefix+'/';
	if((prefix !== ppath) && (sprefix !== ppath)){return false;}
	let user    = await fesession.getUser(ctx);
	if(user === undefined){return false;}
	return user.passwordExpired !== 1;
};

const reqStartpage = async ctx => {
	switch(config.get("startpage")){
	case "shop":
		return await shop.reqGetShop(ctx);
	case "login":
		return await reqLogin(ctx);
	}
};

export const reqFilter = async (ctx,next) => {
	if((ctx.request.path === '/') || (ctx.request.path === '')){
		return reqStartpage(ctx,next);
	}else if(await fesession.checkPassword(ctx)){
		ctx.redirect(ctx.request.url);
	}
	return reqLogin(ctx);
};

export const reqRelaxedFilter = async (ctx,next) => {
	if(fesession.check(ctx) && await pwreset.changeCheck(ctx)){
		return pwreset.changePage(ctx);
	}
	return next(ctx);
};

const reqRegister = async ctx => {
	let arr    = {};
	arr.title  = 'Registrierung'
	arr.status = 'Bitte geben Sie ihre E-Mail-Adresse und ein Passwort für Ihr neues Benutzerkonto ein.';
	arr.errors = [];
	arr.redirect = '';
	if((ctx.method === 'POST') && (ctx.request.body !== undefined)){
		if(fesession.get(ctx)                !== null)     {arr.errors.push("Bitte melden Sie sich ab bevor Sie einen neues Konto anlegen.");}
		if(ctx.request.body.email            === undefined){arr.errors.push('Bitte geben Sie Ihre E-Mail-Adresse ein');}
		if(ctx.request.body.password         === undefined){arr.errors.push('Bitte geben Sie ein Passwort');}
		let email = ctx.request.body.email;
		let pw    = ctx.request.body.password;
		if(pw.length < 8){arr.errors.push('Ihr Passwort muss mindestens 8 Zeichen lang sein.');}
		let user = await feuser.getByName(email);
		if(user !== undefined) {arr.errors.push("Die von Ihnen angegebene E-Mail-Adresse befindet sich bereits im System, bitte verwenden Sie eine andere oder melden Sie sich an.");}
		if(arr.errors.length === 0){
			let userid = await feuser.add(email,pw,email);
			await fesession.start(ctx,userid);
		}
	}
	ctx.body = await template.renderPage('register',arr,false,ctx);
};

const reqGetUserSettings = async ctx => {
	let user   = await fesession.getUser(ctx);
	let arr    = {};
	arr.title  = 'Ihre Daten'
	arr.status = '';
	arr.user   = user;
	arr.user.products = await feuser.getActiveProds(user.ID);
	if(ctx.feuserStatus !== undefined){arr.status = ctx.feuserStatus;}

	ctx.body = await template.renderPage('feuserSettings',arr,false,ctx);
};

const reqPostUserSettings = async ctx => {
	let user   = await fesession.getUser(ctx);
	switch(ctx.request.body.verb){
	case 'pwExpire':
		if(await feuser.tryLogin(user.name,ctx.request.body.password) != null){
			feuser.expirePW(user.ID);
			ctx.redirect(ctx.request.originalUrl);
			return;
		}
		ctx.feuserStatus = '<p class="error">Passwort nicht korrekt, bitte &uuml;berpr&uuml;fen Sie ihre Eingabe.</p>';
		break;

	case 'deleteUser':
		ctx.feuserStatus = '<p>Eine E-Mail mit einem Link zum l&ouml;schen all ihrer Daten wurde ihnen soeben gesendet.</p>';
		addDeletionRequest(user.ID)
		break;
	}
	return await reqGetUserSettings(ctx);
};

const userDeletePage = async ctx => {
	let arr    = {};
	let hash   = getDeletionHash(ctx.request.path);
	let user   = await fesession.getUser(ctx);
	arr.title  = 'Alle Daten löschen';
	arr.status = '<p>Bitte pr&uuml;fen Sie den Link und stellen Sie sicher, dass Sie eingeloggt sind damit wir Ihren Account vollst&auml;ndig l&ouml;schen k&ouml;nnen.</p>';

	if((resetRequests[hash] !== undefined) && (resetRequests[hash] === user.ID)){
		if((ctx.method === 'POST') && (ctx.request.body !== undefined) && (ctx.request.body.confirm !== undefined)){
			arr.status   = '<p>Ihr Account wurde vollst&auml;ndig und unwiederruflich gel&ouml;scht, vielen Dank dass Sie das mBook genutzt haben.</p>';
			feuser.delete(user.ID);
			delete resetRequests[hash];
			fesession.stop(ctx);
		}else{
			arr.status = '<p>Sind Sie sicher, dass Sie Ihren Account und alle dazugeh&ouml;rigen Daten l&ouml;schen wollen?</p><form method="POST" action="'+ctx.request.originalUrl+'" class="login-form"><input type="submit" class=delete name=confirm value="Account Löschen"/></form>';
		}
	}
	ctx.body = await template.renderPage('userDelete',arr,false,ctx);
};

const reqGetImpressum = async ctx => {
	let arr    = {};
	arr.title  = 'Impressum'
	ctx.body = await template.renderPage('impressum',arr,false,ctx);
};

const reqGetDatenschutz = async ctx => {
	let arr    = {};
	arr.title  = 'Datenschutzerklärung'
	ctx.body = await template.renderPage('datenschutz',arr,false,ctx);
};

export const addRoutes = router => {
	router.post('/userSettings/',reqFilter, reqPostUserSettings);
	router.post('/userSettings', reqFilter, reqPostUserSettings);
	router.get ('/userSettings/',reqFilter, reqGetUserSettings);
	router.get ('/userSettings', reqFilter, reqGetUserSettings);
	router.all ('/login',        reqLogin);
	router.all ('/register',     reqRegister);
	router.get ('/impressum',    reqGetImpressum);
	router.get ('/datenschutz',  reqGetDatenschutz);
};