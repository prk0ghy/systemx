import {createDBConnection} from './orm';
import express from 'express';
import config from './config';
import {TrackingEntry} from './model/TrackingEntry';
const start = async () => {
	const db = await createDBConnection();
	console.log('established database connection');

	const app = express();
	app.use(express.json({limit: '1Mb'}));

	const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.log(`[${new Date().toLocaleString('de')}][${req.method}]:: ${req.url}`);
		next();
	};

	app.use(logger);

	app.get('/robots.txt', (req, resp) => {
		resp.send('User-Agent: *\r\nDisallow: /\r\n');
	});

	app.post('/stats', async (req, resp) => {
		resp.setHeader('Access-Control-Allow-Origin', '*');
		resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		resp.setHeader('Access-Control-Allow-Methods', 'POST, GET');

		const entry = new TrackingEntry();
		entry.domain = req.body.domain;
		entry.guid = req.body.guid;
		entry.location = req.body.location;

		try {
			await db.manager.save(entry);
			resp.sendStatus(200);
			return;
		} catch (error) {
			console.error(`error: ${(error as Error).message}`);
			resp.sendStatus(400);
		}
	});

	app.listen(config.port, () => {
		console.log(`running on localhost:${config.port}`);
	});
};

(async () => {
	await start();
})();
