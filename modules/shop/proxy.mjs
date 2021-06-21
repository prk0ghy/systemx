import * as configuration from "./configuration.mjs";
import * as template from "./template.mjs";
import http from "http";
import https from "https";
const proxyDoRequest = (ctx,host) => new Promise((resolve, reject) => {
	if(host === null){reject(new Error("Unknown origin"));}
	const url = host+ctx.request.path;
	const options    = {};
	options.headers  = {};
	if(ctx.request.headers["user-agent"] !== undefined){
		options.headers["user-agent"]      = ctx.request.headers["user-agent"];
	}
	if(ctx.request.headers.accept !== undefined){
		options.headers.accept          = ctx.request.headers.accept;
	}
	if(ctx.request.headers["accept-language"] !== undefined){
		options.headers["accept-language"] = ctx.request.headers["accept-language"];
	}

	const lib = url.startsWith("https") ? https : http;
	const request = lib.get(url, options, (response) => {
		if (response.statusCode < 200 || response.statusCode >= 400) {
			ctx.response.status = response.statusCode;
			ctx.response.type = "text/html";
			ctx.body = template.renderPageSimple("error",{code: response.statusCode},false,ctx);
			resolve("");
		}
		if (response.statusCode >= 300 && response.statusCode <= 399) {
			ctx.response.headers = response.headers;
			let location = response.headers.location;
			if(location.startsWith("http://")) {location = location.substr(7);}
			if(location.startsWith("https://")){location = location.substr(8);}
			const i = location.indexOf("/");
			if(i >= 0){location = location.substr(i);}

			ctx.redirect(location);
			resolve("");
		}

		const body = [];
		response.on("data", chunk => {
			body.push(chunk);
		});
		response.on("end", () => {
			ctx.response.headers = response.headers;
			ctx.response.body    = Buffer.concat(body);
			ctx.response.type    = response.type;

			resolve(ctx.body);
		});
	});
	request.on("error", () => {
		ctx.response.status = 500;
		ctx.response.type = "text/html";
		ctx.body = template.renderPageSimple("error",{code: 500},false,ctx);
		resolve("");
	});
});

const reqProxy = async ctx => {
	await proxyDoRequest(ctx,configuration.getOrigin(ctx));
};
export default reqProxy;
