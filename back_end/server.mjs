import finalHandler from "finalhandler";
import http from "http";
import options from "./options.mjs";
import serveStatic from "serve-static";
export function start(staticBasePath) {
	const serve = serveStatic(staticBasePath, {
		"index": "index.html"
	});
	const server = http.createServer((request, response) => {
		const done = finalHandler(request, response);
		serve(request, response, done);
	});
	server.listen(options.httpPort);
}
