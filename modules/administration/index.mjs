import options, { currentTarget } from "../common/options.mjs";
import serve from "./server.mjs";

const start = async () => {
	serve(currentTarget);
	console.log(`Administration started: http://localhost:${options.httpPort}/`);
};
export default start;
