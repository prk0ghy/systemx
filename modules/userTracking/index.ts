import {server} from './server';
import {createDBSchema} from './logTracking';
import {createLogTrackingDatabase} from './logDatabase';
import config from './config';

const start = async (): Promise<void> => {
	const db = await createLogTrackingDatabase();
	await createDBSchema(db);
	server(db);
	console.log(`user-tracking: http://localhost:${config.port}/ for target: ${config.target}`);
};

(async () => {
	await start();
})();
