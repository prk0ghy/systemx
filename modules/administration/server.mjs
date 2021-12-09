import http from "http";
import options from "../common/options.mjs";
import dispatch from "./job.mjs";

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
		} else if (request.method === 'POST') {
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			response.setHeader('Access-Control-Allow-Methods', 'POST');
			let json = '';

			request.on('data', data => {
				json += data.toString('utf8');
				if (json.length > 1e6) { //if bigger than 1MB, kill
					request.socket.destroy();
				}
			});

			request.on('end', () => {
				try {
					const data = JSON.parse(json);
					console.log(data);
					response.end(JSON.stringify(dispatch(data)));
				} catch(e) {
					console.error(e);
					response.end(JSON.stringify(`{status:"failure"}`));
				}
			});
		}else {
			response.end("");
		}
	});
	server.listen(options.administrationHttpPort);
};
