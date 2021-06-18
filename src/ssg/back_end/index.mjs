import * as target  from "./target.mjs";
import open from "open";
import {currentTarget, default as options} from "../../common/options.mjs";
import serve from "./server.mjs";

const start = async () => {
	await target.build(currentTarget);
	if (options.startServer) {
		serve(currentTarget);
		console.log(`Starting server on http://localhost:${options.httpPort}/`);
	}
	if (options.openBrowser) {
		try {
			open(options.startServer
				? `http://localhost:${options.httpPort}/`
				: `file://${process.cwd()}/dist/web/${currentTarget}/index.html`
			);
		} catch {
			/* Not a problem if we can't open a browser window, as this is only a convenience feature. */
		}
	}
};
export default start;
