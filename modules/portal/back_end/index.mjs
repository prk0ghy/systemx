import loadModules from "../../common/loadModules.mjs";
import * as configuration from "./OLD/configuration.mjs";
// import * as frontend from "./OLD/frontend.mjs";
import RequestHandler from "./request.mjs";
import { filterBuildAll } from "./filter.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import KoaStatic from "koa-static";
import KoaMount from "koa-mount";
// import proxy from "./features/proxy.mjs";

const start = async () => {
	//configuration.printConfig();
	const features    = await loadModules("modules/portal/back_end/features");
	const modules     = await loadModules("modules/portal/back_end/handler");
	console.log({...features,...modules});
	const application = new Koa();
	const router      = new KoaRouter();
	router.all("/portal-user", RequestHandler(filterBuildAll(),{allowCORS: true}));
	application
		.use(koaBody())
		// .use(koaMount(`/${configuration.get("prefix")}/resources`, new Koa().use(koaStatic(`web/${currentTarget}/resources`))))
		.use(router.routes())
		.use(KoaStatic("modules/portal/front_end/.next/server/pages"))
		.use(KoaStatic("modules/portal/front_end/public"))
		.use(KoaMount(`/_next/static`, new Koa().use(KoaStatic("modules/portal/front_end/.next/static"))))
		//.use(frontend.reqFilter)
		//.use(proxy)
		.listen(configuration.get("port"));
	console.log(`Shop started: ${configuration.get("baseurl")}/`);
};
export default start;
