import * as Session from "./session.mjs";
import Options from "../../common/options.mjs";
import Koa from "koa";
import KoaStatic from "koa-static";
import KoaMount from "koa-mount";

/* Return a koa handler that redirects when a user is not
 * logged in or not in the right userGroup
 */
const mountPermissionCheck = mount => {
	return async (ctx,next) => {
		const ses = Session.get(ctx);
		if(!ses || !ses?.user?.groups){
			return ctx.redirect("/login");
		}
		if(Array.isArray(mount.userGroup)){
			for(const group of mount.userGroup){
				if(!ses.user.groups[group]){
					return ctx.redirect("/shop");
				}
			}
		}else{
			if(!ses.user.groups[mount.userGroup]){
				return ctx.redirect("/shop");
			}
		}
		return await next(ctx);
	};
};

const mountAll = app => {
	for(const mount of Options.portal.mounts){
		const handler = new Koa().use(mountPermissionCheck(mount))
		                         .use(KoaStatic(mount.localDir));
		app.use(KoaMount(mount.url, handler));
	}
};
export default mountAll;