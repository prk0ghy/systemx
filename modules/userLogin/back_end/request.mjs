import * as Session from "./session.mjs";

/* Build a KOA request filter using the filters passed along
 * (that should be built using filter.buildAll()).
 */
const requestfilter = (filter,{
	allowCORS = false
}) => {
	/* Handle a single request, should be treated as async since all filters are
	 * async
	 */
	const doSingleRequest = v => {
		if(!v.req)                {v.res.error = "Malformed request";    return v;}
		if(!v.req.id)             {v.res.error = "Missing id field";     return v;}
		v.res.id = v.req.id;
		if(!v.req.action)         {v.res.error = "Missing action field"; return v;}
		if(!filter[v.req.action]) {v.res.error = "Unknown action";       return v;}
		return filter[v.req.action](v);
	};
	/* Run every RPC in body.requests through the specified filter, and thread
	 * the session (ses) through every single call.
	 */
	const filterequests = async (ctx, body) => {
		if(!body?.requests){return [];}
		const ret = [];
		let ses = body.sessionID ? Session.getByID(body.sessionID) : Session.get(ctx);
		for(const req of body.requests){
			const tmp = await doSingleRequest({ctx,req,ses,res:{}});
			ses = tmp.ses;
			ret.push(tmp.res);
		}
		if(ses?.sessionID){
			Session.set(ses?.sessionID,ses);
			Session.setCookie(ctx,ses?.sessionID);
		}
		return ret;
	};
	return async ctx => {
		if(allowCORS){
			ctx.set('Access-Control-Allow-Origin', '*');
			ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			ctx.set('Access-Control-Allow-Methods', 'POST, GET');
		}
		ctx.body = {
			error: false,
			responses: await filterequests(ctx,ctx?.request?.body)
		};
	};
};
export default requestfilter;
