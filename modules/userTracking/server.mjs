import http from 'http';
import {logTracking} from './logTracking.mjs';
/*
 * Starts a HTTP Server responding to userTracking calls.
 */
export default () => {
	const server = http.createServer(async (request, response) => {
		if (request.url === '/robots.txt') {
			response.end('User-agent: *\nDisallow: /\n');
		} else if (request.method === 'POST' && request.url === '/stats') {
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			response.setHeader('Access-Control-Allow-Methods', 'POST, GET');
			let json = '';

			request.on('data', data => {
				json += data.toString('utf8');
			});

			if (json.length > 1e6) { // If bigger than 1MB, kill
				request.socket.destroy();
			}

			request.on('end', () => {
				try {
					const parsed = JSON.parse(json);
					logTracking(parsed);
				} catch (e) {
					// Do nothing on error
					console.log(e);
				}

				response.end('ok');
			});
		}
	});
	server.listen(parseInt(process.env.USER_TRACKING_PORT, 10));
};
