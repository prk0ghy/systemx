import 'dotenv/config';
import serve from './server.mjs';
import {createDBSchema} from './logTracking.mjs';

const start = async () => {
	await createDBSchema();
	const target = process.env.USER_TRACKING_TARGET;
	serve(target);
	console.log(`user-tracking: http://localhost:${parseInt(process.env.USER_TRACKING_PORT, 10)}/ for target: ${target}`);
};

await start();
