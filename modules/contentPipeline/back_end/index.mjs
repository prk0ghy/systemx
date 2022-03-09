import * as target  from "./egress/html/target.mjs";
import options, { currentTarget } from "../../common/options.mjs";
import loadModules from "../../common/loadModules.mjs";
import serve from "./server.mjs";

const start = async (action) => {
	await loadModules("modules/contentPipeline/back_end/ingress");
	await loadModules("modules/contentPipeline/back_end/egress");

	await target.build(currentTarget);
	if (action === "preview") {
		serve(currentTarget);
		console.log(`Content preview server started: http://localhost:${options.httpPort}/`);
	}
};
export default start;
