import * as configuration from "./configuration.mjs";
import * as besession from "./besession.mjs";
import * as feuser from "./feuser.mjs";

export const addRoutes = router => {
	router.all ('/backend',       reqFilter, reqBackend);
	router.all ('/backend/',      reqFilter, reqBackend);
	router.all ('/backend/logout',reqFilter, reqLogout);
};

const reqLogout = ctx => {
	besession.stopSession(ctx);
	ctx.redirect(configuration.absoluteUrl('/backend'));
};

const reqBackend =  async ctx => {
	if(!(besession.check(ctx)) && !(await besession.checkPassword(ctx))){
		await reqLoginPage(ctx);
		return;
	}

	await checkBackendPost(ctx);
	const arr = {};
	arr.title = 'Backend';
	arr.users = await getUsersHTML();

	ctx.body = await template.renderPage('backend',arr,false,ctx);
};

const reqFilter = async (ctx,next) => {
	if (besession.check(ctx)){
		return await next(ctx);
	}else if(await besession.checkPassword(ctx)){
		ctx.redirect(ctx.request.url);
		return null;
	}else{
		return reqLoginPage(ctx);
	}
};

const reqLoginPage = async (ctx) => {
	const arr = {};
	arr.title  = 'Backend Login';
	arr.status = '';
	if((ctx.method === 'POST') && (ctx.request.body !== undefined) && (ctx.request.body.beusername !== undefined)){

		arr.status = '<p>Passwort ungueltig, bitte versuche es erneut!</p>';
	}

	ctx.body = await template.renderPage('belogin',arr,false,ctx);
};

const getUsersHTML = async () => {
	const users = await feuser.getAll();
	if(users === undefined){return '';}
	if(users === null){return '';}

	return users.map(row => `
	<div class="user" row-id="${row.ID|0}"><span class="username">${template.escapeHTML(row.name)}</span>
	<form method="POST" action="${configuration.prefixUrl('/backend')}" class="backend-form">
	<input type="hidden" name="verb" value="delete"/>
	<input type="hidden" name="id" value="${row.ID|0}"/>
	<input type="submit" value="Löschen" class=delete />
	</form>

	<form method="POST" action="${configuration.prefixUrl('/backend')}" class="backend-form">
	<input type="hidden" name="verb" value="changepw"/>
	<input type="hidden" name="id" value="${row.ID|0}"/>
	<label class="form-row inline-row">
	<input type="text" name="pass"/>
	<span>Password</span>
	</label>
	<input type="submit" value="Passwort ändern" class="inline-button"/>
	</form>
	</div>`).join("");
};

const checkBackendPost = async ctx => {
	if(ctx.method !== 'POST')               {return;}
	if(ctx.request.body === undefined)      {return;}
	if(ctx.request.body.verb === undefined) {return;}
	const POST = ctx.request.body;

	switch(ctx.request.body.verb){
	default:
		break;
	case 'delete':
		feuser.deleteUser(POST.id|0);
		break;
	case 'changepw':
		feuser.changePW(POST.id|0,POST.pass);
		break;
	case 'insert':
		await feuser.add(POST.name,POST.email,POST.pass);
		break;
	}
};

export const handleRequest = async ctx => {

};