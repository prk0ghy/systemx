import loadModules from "../../common/loadModules.mjs";
import Mount from "./mount.mjs";
import Options from "../../common/options.mjs";
import * as Template from "../../common/template.mjs";
import RequestHandler from "./request.mjs";
import * as Session from "./session.mjs";
import { buildAll as filterBuildAll } from "./filter.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import Logger from "./logger.mjs";

const start = async () => {
	Logger.debug(`running in ${Options.mode} mode`);
	await loadModules("modules/userLogin/back_end/features");
	await Template.loadDir("modules/userLogin/back_end/templates/");
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
