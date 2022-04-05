import "dotenv/config";
import * as target  from "./egress/html/target.mjs";
import serve from "./server.mjs";
import loadModules from "systemx-common/loadModules.mjs";
import config from "./config.mjs";

const start = async () => {
	await loadModules("./ingress");
	await loadModules("./egress");

	await target.build(config.target);
	if (config.enablePreview) {
		console.log("running in preview mode");
		serve(config.target);
		console.log(`Content preview server started: http://localhost:${config.port}/`);
	}
};
try {
	await start();
} catch (error) {
	console.log(error);
}
