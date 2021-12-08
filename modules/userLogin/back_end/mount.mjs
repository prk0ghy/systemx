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
			console.log("No session, or not groups");
			return ctx.redirect("/");
		}
		if(Array.isArray(mount.userGroup)){
			for(const group of mount.userGroup){
				if(!ses.user.groups[group]){
					console.log("Not in right groups");
					return ctx.redirect("/");
				}
			}
		}else{
			if(mount.userGroup && !ses.user.groups[mount.userGroup]){
				console.log(mount);
				console.log(ses.user);
				console.log("Not in right group");
				return ctx.redirect("/");
			}
		}
		return await next(ctx);
	};
};
const mountAll = app => {
	for(const mount of Options.portal.mounts){
		const handler = new Koa()
			.use(mountPermissionCheck(mount))
			.use(KoaStatic(mount.localDir));
		app.use(KoaMount(mount.url, handler));
	}
};
export default mountAll;
