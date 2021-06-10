import Error from "./types/helper/Error.mjs";
import { formatBytes } from "./format.mjs";
import fs from "fs";
import options from "./options.mjs";
import https from "https";
import query from "./cms.mjs";
/*
* Types should be able to call `render` without providing their context,
* as it makes content types much easier to use.
*
* Hence, we bind all relevant information to the function such that type modules become simpler.
*/
const contextualize = types => context => Object.fromEntries([...types.entries()]
	.map(([name, {
		module
	}]) => {
		const {
			render,
			queries,
			...rest
		} = module.default;
		return [name, {
			render: (model, hints = context.hints) => {
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

export const escapeHTML = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
/*
* The rendering context is a small set of properties that is useful for debugging.
* Moreover, it also comes with a `render` function that can be used for recursive rendering.
*
* Lastly, the `Error.render` function allows you to log a stack trace in the front end.
*/
export default class {
	static completed = new Set();
	static pending = new Set();
	attributeIf = (attribute, condition, thenValue = condition, elseValue = "") => condition
		? `${attribute}="${thenValue}"`
		: elseValue;
	contentTypeIDIf = ( ...rest) => this.attributeIf("content-type-id", ...rest);
	classIf = (...rest) => this.attributeIf("class", ...rest);
	contentTypes = null;
	escapeHTML = escapeHTML;
	download = url => {
		downloads.set(url, {});
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
		const modificationDate = new Date(year, month - 1, day, hour - 1, minute, second);
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
		}, this)
	};
	Error = {
		render: ({ ...args }) => Error.render({
			...args,
			type: this.type
		}, this)
	};
	helpers = null;
	hints = null;
	query = query;
	type = null;
	constructor({
		cms,
		globalRender,
		hints = {},
		isMock,
		model = {
			__typename: "root"
		},
		parentContext = null,
		types
	}) {
		this.types = types || parentContext.types;
		this.cms = cms || parentContext.cms;
		this.contentTypes = contextualize(this.types.content)(this);
		this.download = options.downloadMedia
			? parentContext?.download || this.download
			: url => url;
		this.globalRender = globalRender || parentContext.globalRender;
		this.helpers = contextualize(this.types.helper)(this);
		this.hints = Object.assign({}, hints, parentContext?.hints);
		this.isMock = isMock || parentContext?.isMock;
		this.model = model;
		this.parentContext = parentContext;
		this.type = model.__typename;
		this.render = this.render.bind(this);
	}
	render(model, hints) {
		const context = new this.constructor({
			globalRender: this.globalRender,
			hints,
			model,
			parentContext: this
		});
		return this.globalRender(model, context, hints);
	}
}
