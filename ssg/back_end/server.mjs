import finalHandler from "finalhandler";
import { getDistributionPath } from "../../common/paths.mjs";
import http from "http";
import options from "../../common/options.mjs";
import path from "path";
import serveStatic from "serve-static";
import { renderSingleEntry } from "./target.mjs";
/*
* Content URIs correspond to rendered entries.
* Resources like fonts are not considered content URIs.
*/
const isContentURI = pathName => {
	const parts = String(pathName).split("/");
	const lastPart = parts[parts.length - 1];
	return !lastPart || !lastPart.includes(".") || /index\.html?/.test(lastPart);
};
/*
* Transforms a URL
*/
const toCraftCMSSlug = pathName => {
	const parts = String(pathName).split("/");
	const lastPart = parts[parts.length - 1];
	return !lastPart || /index\.html?/.test(lastPart)
		? decodeURI(parts.slice(1, parts.length - 1).join("/"))
		: !lastPart.includes(".")
			? decodeURI(parts.slice(1, parts.length).join("/"))
			: pathName;
};
/*
* Starts an HTTP server for target `targetName`.
*
* This will serve all resources for this target and render entries on demand.
* Ideally, this function is used for previews.
*/
export default async targetName => {
	const distributionPath = await getDistributionPath();
	const serve = serveStatic(path.join(distributionPath, targetName), {
		index: "index.html"
	});
	const server = http.createServer(async (request, response) => {
		const isDone = finalHandler(request, response);
		if (request.url === "/robots.txt") {
			response.end("User-agent: *\nDisallow: /\n");
		}
		else if (isContentURI(request.url)) {
			const {
				html,
				status
			} = await renderSingleEntry(targetName, toCraftCMSSlug(request.url));
			response.writeHead(status);
			response.end(html);
		}
		else {
			serve(request, response, isDone);
		}
	});
	server.listen(options.httpPort);
};
