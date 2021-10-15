import loadModules from "../../common/loadModules.mjs";
import Mount from "./mount.mjs";
import Options from "../../common/options.mjs";
import * as Template from "../../common/template.mjs";
import RequestHandler from "./request.mjs";
import { buildAll as filterBuildAll } from "./filter.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import KoaStatic from "koa-static";
import KoaMount from "koa-mount";
const start = async () => {
	const features    = await loadModules("modules/portal/back_end/features");
	await Template.loadDir("modules/portal/back_end/templates/");
	console.log(features);
	const app    = new Koa();
	const router = new KoaRouter();
	router.all("/portal-user", RequestHandler(filterBuildAll(),{allowCORS: true}));
	app
		.use(koaBody())
		.use(router.routes())
		.use(KoaStatic("modules/portal/front_end/.next/server/pages"))
		.use(KoaStatic("modules/portal/front_end/public"))
		.use(KoaMount(`/_next/static`, new Koa().use(KoaStatic("modules/portal/front_end/.next/static"))));
	Mount(app);
	//.use(frontend.reqFilter)
	//.use(proxy)
	app.listen(Options.portalHttpPort);
	console.log(`Shop started: http://localhost:${Options.portalHttpPort}/`);
};
export default start;
