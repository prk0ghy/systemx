import http from "http";
import options from "../common/options.mjs";
import logTracking from "./logTracking.mjs";

/*
* Starts an HTTP server for target `targetName`.
*
* This will serve all resources for this target and render entries on demand.
* Ideally, this function is used for previews.
*/
export default () => {
	const server = http.createServer(async (request, response) => {
		if (request.url === "/robots.txt") {
			response.end("User-agent: *\nDisallow: /\n");
		}
		else if (request.method === 'POST' && request.url ==='/stats') {
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			response.setHeader('Access-Control-Allow-Methods', 'POST, GET');
			let json = '';

			request.on('data', data => {
				json += data.toString('utf8');
			});

			if (json.length > 1e6) { //if bigger than 1MB, kill
				request.socket.destroy();
			}

			request.on('end', () => {
				console.log(JSON.parse(json));
				try {
					const parsed = JSON.parse(json);
					logTracking(parsed);
				} catch(e) {
					console.log(e); // error in the above string (in this case, yes)!
				}
				//logTracking();
				response.end("ok");
			});
		}
	});
	server.listen(options.trackingHttpPort);
};
