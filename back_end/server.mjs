import finalhandler from "finalhandler";
import http from "http";
import serveStatic from "serve-static";
import { httpPort } from "./options.mjs";

export function start(staticBasePath) {
	const serve = serveStatic(staticBasePath, {
		"index": "index.html"
	});
	const server = http.createServer((req, res) => {
		const done = finalhandler(req, res);
		serve(req, res, done);
	});
	server.listen(httpPort);
}
