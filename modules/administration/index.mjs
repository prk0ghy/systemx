import 'dotenv/config';
import serve from './server.mjs';

const start = async () => {
	const target = process.env.ADMINISTRATION_TARGET;
	serve(target);
	console.log(
		`Administration started: http://localhost:${parseInt(process.env.ADMINISTRATION_PORT, 10)}/ with target: ${target}`,
	);
};

await start();
