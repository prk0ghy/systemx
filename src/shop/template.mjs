import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

import * as config from "./config.mjs";
import * as cart from "./cart.mjs";
import * as fesession from "./fesession.mjs";

const templates = [];
let pagePreamble = "";
let pageFooter   = "";

const fileExtension = str => {
	let ppos = str.lastIndexOf('.');
	return str.substr(ppos+1).toLowerCase();
};

(() => {
	pagePreamble = "<!DOCTYPE html>\n<html lang="+config.get('lang')+">\n <head>\n";

	config.get('resources').forEach( path => {
		let data = fs.readFileSync(path).toString();
		switch(fileExtension(path)){
		case 'js':
			pageFooter += "  <script>\n"+data+"\n  </script>\n";
			break;
		case 'css':
			pagePreamble += "  <style>\n"+data+"\n  </style>\n";
			break;
		}

	});
	pageFooter += '  <script>let baseUrl="' + config.absoluteUrl('') + '";</script>';

	let files = fs.readdirSync("src/shop/views/");
	files.forEach(file => {
		const name = path.parse(file).name;
		templates[name] = fs.readFileSync(`src/shop/views/${file}`).toString();
	});
})();

export const escapeHTML = text => {
	let map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
};

const checkArr = (template,arr,shop,ctx) => {
	if(arr['title'] === undefined)   {arr['title'] = '';}
	if(arr['redirect'] === undefined){arr['redirect'] = config.get('baseurl') + ctx.request.path;}
	if(arr['err'] === undefined)     {arr['err'] = '';}
	arr['abslink'] = config.get('baseurl') + '/' + config.get('prefix');
	arr['session'] = fesession.get(ctx);
	arr['cart']    = cart.get(ctx);

	return arr;
};

const getHeader = () => {
	let ret = '<header><nav aria-label="Navigation des Portals">';

	ret += '<ul id="nav-left">';
	ret += '<li class="home"><a href="'+config.get('baseurl')+'">Home</a></li>';
	ret += '</ul>'

	ret += '<ul id="nav-right">';
	ret += '<li class="open-nav">mein MVet</li>';
	// if(arr.session !== undefined){
	// 	ret += '<li class="login"><a href="'+config.absoluteUrl('/logout')+'">Logout</a></li>';
	// }else{
	// 	ret += '<li class="login"><a href="'+config.absoluteUrl('/login')+'">Login</a></li>';
	// }
	ret += '</ul>'

	return ret+'</nav></header>';
};

const getUserPanelLogin = (template, arr) => {
	let loginHtml = '<form action="'+config.absoluteUrl('/login')+'" method="POST" class="login-form">';
	loginHtml += '<input type="hidden" name="redirect" value="' + arr['redirect'] + '"/>';
	loginHtml += '<label class=form-row><input autofocus type="text" name="username"/><span>Benutzername</span></label>';
	loginHtml += '<label class=form-row><input type="password" name="password"/><span>Passwort</span></label>';
	loginHtml += '<input type="submit" value="Einloggen"/>';
	loginHtml += '<a href="<%- pwresethref %>" class="pwreset">Passwort vergessen?</a>';
	loginHtml += '</form>';

	return loginHtml;
};

const getUserPanelNav = () => {
	//let ret = '<div class="userpanel-container">';
	return '<p>NAV</p>';
};

const getUserPanel = (template, arr) => {
	let ret = '<div class="userpanel-container">';

	if((arr.session !== undefined) && (arr.session !== null)){
		ret += getUserPanelNav(template, arr);
	}else{
		ret += getUserPanelLogin(template, arr);
	}

	ret +='</div>';
	ret +='<div class="userpanel-overlay"></div>';
	return ret;
};

const getFooter = () => {
	let ret = '';
	ret += '<footer><a href="'+config.absoluteUrl('/impressum')+'">Impressum</a> <a href="'+config.absoluteUrl('/datenschutz')+'">Datenschutzerkl&auml;rung</a></footer>';
	ret += pageFooter;
	return ret;
};

const wrapPage = (template,arr,shop,str) => {
	let ret = pagePreamble;
	ret += '  <title>'+escapeHTML(arr.title)+'</title>\n </head>\n <body class="template-'+template+'">';
	ret += getHeader(template,arr,shop);
	ret += getUserPanel(template,arr,shop);
	ret += '<main>'+str+'</main>';
	ret += getFooter(template,arr,shop);
	ret += '\n </body>\n</html>';

	return ret;
};

export const renderPage = async (template, arr, shop, ctx) => {
	const options = {
		cache: true,
		filename: template,
		async: true
	};
	arr = checkArr(template,arr,shop,ctx);
	if(templates[template] === undefined){template = 'error';}
	return wrapPage(template,arr,shop,await ejs.render(templates[template], arr, options));
};

const replaceMarkers = (text,arr) => {
	for(let key in arr){
		if(!arr.hasOwnProperty(key)){continue;}
		text = text.replace('###'+key+'###',arr[key]+'');
	}
	return text;
};

export const renderPageSimple = (template, arr, shop, ctx) => {
	arr = checkArr(template,arr,shop,ctx);
	if(templates[template] === undefined){template = 'error';}
	return wrapPage(template,arr,shop,replaceMarkers(templates[template],arr));
};
