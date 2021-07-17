import * as configuration from "./configuration.mjs";
import * as backEnd from "./backend.mjs";
import * as cart from "./cart.mjs";
import * as shop from "./shop.mjs";
import * as feuser from "./feuser.mjs";
import * as beuser from "./beuser.mjs";
import * as frontEnd from "./frontend.mjs";
import * as fesession from "./fesession.mjs";
import * as order from "./order.mjs";
import * as payments from "./payments/index.mjs";
import * as pwreset from "./pwreset.mjs";
import { initialize as initializeDatabase } from "./database.mjs";
import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import koaStatic from "koa-static";
import koaMount from "koa-mount";
import proxy from "./proxy.mjs";
const start = async () => {
	await initializeDatabase();
	configuration.printConfig();
	const application = new Koa();
	const router = new KoaRouter();
	router.prefix("/" + configuration.get("prefix"));
	await Promise.all([
		beuser,
		feuser,
		order,
		payments,
		shop
	].map(part => part.default()));
	for (const part of [
		backEnd,
		cart,
		fesession,
		frontEnd,
		pwreset,
		shop
	]) {
		part.addRoutes(router);
	}
	const koa = new Koa();
	koa.use(koaStatic("modules/shop/public"));
	application
		.use(koaBody())
		.use(koaMount("/" + configuration.get("prefix") + "/public", koa))
		.use(frontEnd.reqRelaxedFilter)
		.use(router.routes())
		.use(router.allowedMethods())
		.use(frontEnd.reqFilter)
		.use(proxy)
		.listen(configuration.get("port"));
	console.log("Shop started: " + configuration.get("baseurl"));
};
export default start;
