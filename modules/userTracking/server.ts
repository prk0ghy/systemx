import http from 'http';
import * as sqlite3 from 'sqlite3';
import config from './config';
import {ITrackingData, logTracking} from './logTracking';

export const server = (db: sqlite3.Database): void => {
	const httpServer = http.createServer(async (request, response) => {
		if (request.url === '/robots.txt') {
			response.end('User-Agent: *\nDisallow: /\n');
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
					logTracking(db, parsed as ITrackingData);
				} catch (e) {
					// Do nothing on error
					console.log(e);
				}

				response.end('ok');
			});
		}
	});
	httpServer.listen(config.port);
};
