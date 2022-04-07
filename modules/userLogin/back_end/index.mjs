import "dotenv/config";
import loadModules from "systemx-common/loadModules.mjs";
import Mount from "./mount.mjs";
import * as Template from "systemx-common/template.mjs";
import RequestHandler from "./request.mjs";
import * as Session from "./session.mjs";
import { buildAll as filterBuildAll } from "./filter.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import KoaLogger from "koa-logger";
import Logger from "./logger.mjs";
import config from "./config.mjs";

const start = async () => {
	Logger.debug(`running in ${config.mode} mode`);
	await loadModules("./features");
	await Template.loadDir("./templates");
	const app = new Koa();
	app.use(KoaLogger());
	const router = new KoaRouter();
	const filters = filterBuildAll();
	await Session.loadAll(filters);
	router.all("/portal-user", RequestHandler(filters, { allowCORS: false }));
	app
		.use(koaBody())
		.use(router.routes());
	Mount(app);
	app.listen(config.userLogin.port);
	Logger.info(`Shop started: http://localhost:${config.userLogin.port}/`);
};
await start();
