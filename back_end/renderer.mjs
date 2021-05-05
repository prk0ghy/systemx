import {
	loadContentTypes,
	loadHelperTypes
} from "./types.mjs";
import Error from "./types/helper/Error.mjs";
import { formatBytes } from "./format.mjs";
import fs from "fs";
import https from "https";
import query, { getContext as getCMSContext } from "./cms.mjs";
const cmsContext = await getCMSContext();
const contentTypes = await loadContentTypes();
const helperTypes = await loadHelperTypes();
const warnedContentTypes = new Set();
/*
* Types should be able to call `render` without providing their context,
* as it makes content types much easier to use.
*
* Hence, we bind all relevant information to the function such that type modules become simpler.
*/
const contextualize = types => context => Object.fromEntries([...types.entries()]
	.map(([name, module]) => {
		const {
			render,
			queries,
			...rest
		} = module.default;
		return [name, {
			render: (model, hints) => {
				const map = queries?.get(model.__typename)?.map;
				const mappedModel = map
					? map(model)
					: model;
				return render.bind(module.default)(mappedModel, context, hints);
			},
			...rest
		}];
	}));
const agent = new https.Agent({
	keepAlive: true,
	maxSockets: 64
});
const downloads = new Map();
/*
* The rendering context is a small set of properties that is useful for debugging.
* Moreover, it also comes with a `render` function that can be used for recursive rendering.
*
* Lastly, the `Error.render` function allows you to log a stack trace in the front end.
*/
const RenderingContext = class {
	static completed = new Set();
	static pending = new Set();
	classIf = (condition, thenClassName, elseClassName = "") => condition
		? `class="${thenClassName}"`
		: elseClassName;
	cms = cmsContext;
	contentTypes = contextualize(contentTypes)(this);
	download = url => {
		downloads.set(url, {
			downloadedSize: 0
		});
		const currentDownload = downloads.get(url);
		const urlObject = new URL(url);
		const fileName = decodeURIComponent(urlObject
			.pathname
			.substr(urlObject.pathname.lastIndexOf("/") + 1)
		);
		const modificationTime = urlObject.searchParams.get("mtime");
		const {
			groups: {
				day,
				hour,
				minute,
				month,
				second,
				year
			}
		} = modificationTime.match(/(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})(?<hour>\d{2})(?<minute>\d{2})(?<second>\d{2})/);
		const modificationDate = new Date(year, month - 1, day, hour, minute, second);
		const printStatus = (callback, error, hasDownloadRun) => {
			if (error) {
				console.error("Download failed!", {
					error,
					url
				});
				return callback();
			}
			const totalSize = [...downloads.values()]
				.map(({ size }) => size ?? 0)
				.reduce((x, y) => x + y, 0);
			const totalDownloadedSize = [...downloads.values()]
				.map(({ stream }) => stream?.bytesWritten ?? 0)
				.reduce((x, y) => x + y, 0);
			if (hasDownloadRun) {
				console.debug(`Downloaded ${formatBytes(totalDownloadedSize)} of ${formatBytes(totalSize)} (${(totalDownloadedSize / totalSize * 100).toFixed(2)}\u202f%)`);
			}
			return callback();
		};
		return new Promise((fulfill, reject) => {
			(async () => {
				let wasDownloadNeeded = false;
				const htmlPath = await this.hints.handleMedia(fileName, modificationDate, (path, needsDownload) => {
					wasDownloadNeeded = needsDownload;
					return new Promise(fulfill => {
						if (!needsDownload) {
							fulfill();
							return;
						}
						const request = https.request(url, {
							agent
						}, async response => {
							if (response.statusCode < 200 || response.statusCode >= 300) {
								printStatus(reject, new Error("Bad status code"));
								return;
							}
							currentDownload.size = Number(response.headers["content-length"]);
							const stream = fs.createWriteStream(path);
							currentDownload.stream = stream;
							response.pipe(stream);
							stream.on("finish", () => {
								stream.close();
								fulfill();
							});
						});
						request.on("error", console.error);
						request.end();
					});
				});
				printStatus(() => fulfill(htmlPath), null, wasDownloadNeeded);
			})();
		});
	};
	EditorialError = {
		render: ({ ...args }) => Error.render({
			...args,
			isEditorial: true,
			title: "Editorial action required",
			type: this.type
		})
	};
	Error = {
		render: ({ ...args }) => Error.render({
			...args,
			type: this.type
		})
	};
	helpers = contextualize(helperTypes)(this);
	hints = null;
	query = query;
	type = null;
	constructor(model, parentContext = null, hints = {}) {
		this.model = model;
		this.hints = Object.assign({}, hints, parentContext?.hints);
		this.parentContext = parentContext;
		this.type = model.__typename;
		this.render = this.render.bind(this);
	}
	render(model, hints) {
		const context = new RenderingContext(model, this, hints);
		return render(model, context);
	}
};
/*
* "Rendering" a content type means transforming it to HTML.
* Usually, this function will be used by passing a CraftCMS model to it.
*
* Said model is just an object containing various properties needed for rendering.
* It must include a `__typename` property that allows us to figure out which content
* type we should render.
*
* The rest of properties will be passed on to the corresponding `render` function.
*/
export const render = async (model, context, hints) => {
	const { __typename: type } = model;
	const contentType = (() => {
		for (const [, contentType] of contentTypes) {
			const prototype = contentType.default;
			if ([...(prototype?.queries?.keys() || [])].includes(type)) {
				return prototype;
			}
		}
		return null;
	})();
	if (contentType) {
		const { map } = contentType.queries.get(type);
		if (!contentType.cms) {
			contentType.cms = cmsContext;
		}
		/*
		* Nested content types may have structurally different models.
		* Therefore, they can define a `map` function for each `__typename` in their `queries` section.
		* This allows us to map the result of a query to a known structure prior to rendering it.
		*/
		const mappedModel = map
			? map(model)
			: model;
		return contentType.render(mappedModel, new RenderingContext(mappedModel, context, hints));
	}
	if (!warnedContentTypes.has(type)) {
		console.warn(`Content type "${type}" is currently not supported.`);
		warnedContentTypes.add(type);
	}
	return Error.render({
		message: `This content type is not supported yet.`,
		title: "Unsupported content type",
		type
	});
};
