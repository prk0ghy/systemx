import * as configuration from "./OLD/configuration.mjs";
import * as frontend from "./OLD/frontend.mjs";
import * as user from "./request.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
// import koaStatic from "koa-static";
// import koaMount from "koa-mount";
import proxy from "./features/proxy.mjs";

const start = async () => {
	//configuration.printConfig();
	const application = new Koa();
	const router      = new KoaRouter();
	await user.importHandlers();
	router.all("/portal-user", user.handleRequest);
	application
		.use(koaBody())
		// .use(koaMount(`/${configuration.get("prefix")}/public`, new Koa().use(koaStatic("modules/shop/public"))))
		// .use(koaMount(`/${configuration.get("prefix")}/resources`, new Koa().use(koaStatic(`web/${currentTarget}/resources`))))
		.use(router.routes())
		.use(frontend.reqFilter)
		.use(proxy)
		.listen(configuration.get("port"));
	console.log(`Shop started: ${configuration.get("baseurl")}/`);
};
export default start;
