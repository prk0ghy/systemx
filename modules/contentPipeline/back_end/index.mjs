import * as target  from "./egress/html/target.mjs";
import options, { currentTarget } from "../../common/options.mjs";
import serve from "./server.mjs";

const start = async (action) => {
	await target.build(currentTarget);
	if(action === "preview"){
		serve(currentTarget);
		console.log(`Content preview server started: http://localhost:${options.httpPort}/`);
	}
};
export default start;
