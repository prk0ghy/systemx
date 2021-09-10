import loadModules from "../../common/loadModules.mjs";
import * as Session from "./session.mjs";

let handler = null;

export const importHandlers = async () => {
	handler = await loadModules("modules/portal/back_end/handler");
};

const doSingleRequest = async (ctx, req, session) => {
	if(!req)        {return { error: "Malformed request" };}
	if(!req.id)     {return { error: "Missing id field" };}
	if(!req.action){return { id: req.id, error: "Missing action field" };}
	if(!handler.has(req.action)){return { id: req.id, error: "Unknown action handler" };}
	const ret = await handler.get(req.action).module.default(ctx,req, session);
	if(ret.error === undefined){ret.error = false;}
	if(ret.id === undefined)   {ret.id = req.id;}
	return ret;
};

const handleRequests = async (ctx, reqs) => {
	if(!reqs){return [];}
	const ret = [];
	let session = Session.get(ctx);
	for(const req of reqs){
		const tmp = await doSingleRequest(ctx,req,session);
		session = tmp.session;
		ret.push(tmp.response);
	}
	return ret;
};

export const handleRequest = async ctx => {
	ctx.body = {
		error: false,
		responses: await handleRequests(ctx,ctx?.request?.body?.requests)
	};
};
