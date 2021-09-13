import * as Session from "./session.mjs";

const requestHandler = handler => {
	const doSingleRequest = async v => {
		if(!v.req)                {v.res.error = "Malformed request";    return v;}
		if(!v.req.id)             {v.res.error = "Missing id field";     return v;}
		v.res.id = v.req.id;
		if(!v.req.action)         {v.res.error = "Missing action field"; return v;}
		if(!handler[v.req.action]){v.res.error = "Unknown action";       return v;}
		return await handler[v.req.action](v);
	};
	const handleRequests = async (ctx, reqs) => {
		if(!reqs){return [];}
		const ret = [];
		let ses = Session.get(ctx);
		for(const req of reqs){
			const tmp = await doSingleRequest({ctx,req,ses,res:{}});
			ses = tmp.ses;
			ret.push(tmp.res);
		}
		Session.set(ctx,ses);
		return ret;
	};
	return async ctx => {
		ctx.body = {
			error: false,
			responses: await handleRequests(ctx,ctx?.request?.body?.requests)
		};
	};
};
export default requestHandler;
