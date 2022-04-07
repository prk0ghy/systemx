import * as Session from "./session.mjs";
import config from "./config.mjs";
import {join} from "path";
import Logger from "./logger.mjs";
import Koa from "koa";
import KoaStatic from "koa-static";
import KoaMount from "koa-mount";
/* Return a koa handler that redirects when a user is not
* logged in or not in the right userGroup
*/
const mountPermissionCheck = mount => {
	return async (ctx,next) => {
		const ses = Session.get(ctx);
		if (mount === "resources") {
			return await next(ctx);
		}
		if(!ses || !ses?.user?.groups){
			console.log("No session, or not groups");
			return ctx.redirect("/");
		}
		const groupNames = Object.keys(ses.user.groups);
		if (!groupNames.includes(mount)) {
			Logger.warn(`User ${ses.user.ID} tried to access '${mount}' => denied (not in group)`);
			return ctx.throw(403, "forbidden");
		}
		Logger.info(`[MOUNT]::[${mount}] User: ${ses.user.ID}`);
		return await next(ctx);
	};
};
const mountAll = app => {
	for(const mount of config.userLogin.mounts.targets){
		const path = join(config.userLogin.mounts.baseDir, mount);
		const handler = new Koa()
			.use(mountPermissionCheck(mount))
			.use(KoaStatic(path));
		Logger.info(`mounting: ${mount} => ${path}`);
		app.use(KoaMount(`/${mount}/`, handler));
	}
};
export default mountAll;
