import * as target  from "./target.mjs";
import open from "open";
import {currentTarget, default as options} from "./options.mjs";
import serve from "./server.mjs";

(async () => {
	await target.build(currentTarget);
	if (options.startServer) {
		serve(currentTarget);
		console.log(`Starting server on http://localhost:${options.httpPort}/`);
	}
	if (options.openBrowser) {
		open(options.startServer
			? `http://localhost:${options.httpPort}/`
			: `file://${process.cwd()}/web/${currentTarget}/index.html`
		);
	}
})();
