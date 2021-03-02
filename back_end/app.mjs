import * as options from "./options.mjs";
import * as server from "./server.mjs";
import * as target from "./target.mjs";
import opn from "opn";
(async () => {
	await options.parse(process.argv.slice(2));
	const cTarget = "lasub";
	await target.build(cTarget);
	if (options.startServer) {
		server.start("./web/" + cTarget);
	}
	if (options.openBrowser) {
		if (options.startServer) {
			opn("http://localhost:8080/");
		}
		else {
			opn("file://" + process.cwd() + "/web/" + cTarget + "/index.html");
		}
	}
})();
