import * as configuration from "./configuration.mjs";
import * as backEnd from "./backend.mjs";
import * as frontEnd from "./frontend.mjs";
import { currentTarget } from "../../common/options.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import koaStatic from "koa-static";
import koaMount from "koa-mount";
import proxy from "./proxy.mjs";

const start = async () => {
	configuration.printConfig();
	const application = new Koa();
	const router = new KoaRouter();
	router.all("/portal-frontend", frontEnd.handleRequest);
	router.all("/portal-backend", backEnd.handleRequest);
	application
		.use(koaBody())
		.use(koaMount(`/${configuration.get("prefix")}/public`, new Koa().use(koaStatic("modules/shop/public"))))
		.use(koaMount(`/${configuration.get("prefix")}/resources`, new Koa().use(koaStatic(`web/${currentTarget}/resources`))))
		.use(router.routes())
		.use(router.allowedMethods())
		.use(frontEnd.reqFilter)
		.use(proxy)
		.listen(configuration.get("port"));
	console.log(`Shop started: ${configuration.get("baseurl")}/`);
};
export default start;
