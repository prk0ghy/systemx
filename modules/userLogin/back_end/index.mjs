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
import KoaStatic from "koa-static";

const start = async () => {
	const features = await loadModules("modules/userLogin/back_end/features");
	await Template.loadDir("modules/userLogin/back_end/templates/");
	console.log(features);
	const app     = new Koa();
	const router  = new KoaRouter();
	const filters = filterBuildAll();
	await Session.loadAll(filters);
	router.all("/portal-user", RequestHandler(filters,{allowCORS: true}));
	app
		.use(koaBody())
		.use(router.routes())
		.use(KoaStatic("modules/userLogin/front_end/out",{extensions: ['html']}))
		.use(KoaStatic("modules/userLogin/front_end/public"));
	Mount(app);
	app.listen(Options.portalHttpPort);
	console.log(`Shop started: http://localhost:${Options.portalHttpPort}/`);
};
export default start;