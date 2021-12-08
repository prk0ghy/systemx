import options, { currentTarget } from "../common/options.mjs";
import serve from "./server.mjs";

const start = async () => {
	serve(currentTarget);
	console.log(`UserTracking started: http://localhost:${options.trackingHttpPort}/`);
};
export default start;
