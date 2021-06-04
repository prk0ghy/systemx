import * as target  from "./target.mjs";
import open from "open";
import options from "./options.mjs";
import serve from "./server.mjs";
const cTarget = "lasub";
(async () => {
	await target.build(cTarget);
	if (options.startServer) {
		serve(cTarget);
	}
	if (options.openBrowser) {
		open(options.startServer
			? `http://localhost:${options.httpPort}/`
			: `file://${process.cwd()}/web/${cTarget}/index.html`
		);
	}
})();
