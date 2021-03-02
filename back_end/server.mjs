import http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

export function start(staticBasePath) {
	const serve = serveStatic(staticBasePath, {
		"index": "index.html"
	});
	const server = http.createServer((req, res) => {
		const done = finalhandler(req, res);
		serve(req, res, done);
	});
	server.listen(8080);
}