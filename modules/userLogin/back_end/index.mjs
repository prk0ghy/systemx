import loadModules from "systemx-common/loadModules.mjs";
import Mount from "./mount.mjs";
import Options from "systemx-common/options.mjs";
import * as Template from "systemx-common/template.mjs";
import RequestHandler from "./request.mjs";
import * as Session from "./session.mjs";
import { buildAll as filterBuildAll } from "./filter.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import Logger from "./logger.mjs";

const start = async () => {
	Logger.debug(`running in ${Options.mode} mode`);
	await loadModules("./features");
	await Template.loadDir("./templates");
	const app     = new Koa();
	const router  = new KoaRouter();
	const filters = filterBuildAll();
	await Session.loadAll(filters);
	router.all("/portal-user", RequestHandler(filters,{allowCORS: true}));
	app
		.use(koaBody())
		.use(router.routes());
	Mount(app);
	app.listen(Options.httpPort);
	Logger.info(`Shop started: http://localhost:${Options.httpPort}/`);
};
export default start;
