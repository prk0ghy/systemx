import finalHandler from "finalhandler";
import http from "http";
import options from "./options.mjs";
import serveStatic from "serve-static";
import { renderSingleEntry } from "./target.mjs";

function isContentURL(url){
	const path = String(url).split("/");
	const last = String(path[path.length-1]);
	if((last === "") || (last.indexOf('.') < 0) || (last === "index.html") || (last === "index.htm")){
		return true;
	}
	return false;
}

function transformURL(url){
	const path = String(url).split("/");
	const last = String(path[path.length-1]);
	if((last === "") || (last.indexOf('.') < 0) || (last === "index.html") || (last === "index.htm")){
		const ret = path.slice(1,path.length-1).join("/");
		return decodeURI(ret);
	}
	return url;
}

export function start(targetName) {
	const serve = serveStatic("./web/" + targetName, {
		"index": "index.html"
	});
	const server = http.createServer(async (request, response) => {
		const done = finalHandler(request, response);
		if(isContentURL(request.url)){
			const html = await renderSingleEntry(targetName,transformURL(request.url));
			response.writeHead(200);
			response.end(html);
		}else{
			serve(request, response, done);
		}
	});
	server.listen(options.httpPort);
}
