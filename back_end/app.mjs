import * as options from "./options.mjs";
import * as server  from "./server.mjs";
import * as target  from "./target.mjs";
import * as content_types from "./content_types.mjs";
import opn from "opn";
import "./cms.mjs";

(async () => {
	const cTarget = "lasub";

	await options.parse(process.argv.slice(2));
	await content_types.init();

	await target.build(cTarget);
	if (options.startServer) {
		server.start("./web/" + cTarget);
	}
	if (options.openBrowser) {
		if (options.startServer) {
			opn("http://localhost:" + options.httpPort + "/");
		} else {
			opn("file://" + process.cwd() + "/web/" + cTarget + "/index.html");
		}
	}
})();
