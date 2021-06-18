import * as target  from "./target.mjs";
import options, { currentTarget } from "../../common/options.mjs";
import open from "open";
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
				: `file://${process.cwd()}/${options.distributionPath}/${currentTarget}/index.html`
			);
		}
		catch {
			/* It's not a problem if we can't open a browser window, as this is only a convenience feature. */
		}
	}
};
export default start;
