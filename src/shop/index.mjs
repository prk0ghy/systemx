import Koa from "koa";
import KoaBody from "koa-body";
import KoaRouter from "koa-router";
import KoaStatic from "koa-static";
import KoaMount from "koa-mount";

import * as config from "./config.mjs";
import * as backend from "./backend.mjs";

import * as cart from "./cart.mjs";
import * as shop from "./shop.mjs";
import * as frontend from "./frontend.mjs";
import * as fesession from "./fesession.mjs";
import * as pwreset from "./pwreset.mjs";
import proxy from "./proxy.mjs";

const start = async () => {
	config.printConfig();

	const app       = new Koa();
	const router    = new KoaRouter();

	router.prefix('/'+config.get('prefix'));

	backend.addRoutes(router);
	cart.addRoutes(router);
	fesession.addRoutes(router);
	pwreset.addRoutes(router);
	frontend.addRoutes(router);
	shop.addRoutes(router);

	const fileserve = new Koa();
	fileserve.use(KoaStatic("src/shop/public"));

	app
		.use(KoaBody())
		.use(KoaMount('/'+config.get('prefix')+'/public',fileserve))
		.use(frontend.reqRelaxedFilter)
		.use(router.routes())
		.use(router.allowedMethods())
		.use(frontend.reqFilter)
		.use(proxy)
		.listen(config.get('port'));

	console.log("HTTP Server started on Port "+config.get('port'));
};
export default start;
