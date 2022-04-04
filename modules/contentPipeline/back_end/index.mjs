import * as target  from "./egress/html/target.mjs";
import options, { currentTarget } from "systemx-common/options.mjs";
import serve from "./server.mjs";
import loadModules from "systemx-common/loadModules.mjs";

const start = async (action) => {
	await loadModules("./ingress");
	await loadModules("./egress");

	await target.build(currentTarget);
	if (action === "preview") {
		serve(currentTarget);
		console.log(`Content preview server started: http://localhost:${options.httpPort}/`);
	}
};
export default start;
