import * as server  from "./server.mjs";
import * as target  from "./target.mjs";
import open from "open";
import options from "./options.mjs";
const cTarget = "lasub";
await target.build(cTarget);
if (options.startServer) {
	server.start("./web/" + cTarget);
}
if (options.openBrowser) {
	open(options.startServer
		? `http://localhost:${options.httpPort}/`
		: `file://${process.cwd()}/web/${cTarget}/index.html`
	);
}
