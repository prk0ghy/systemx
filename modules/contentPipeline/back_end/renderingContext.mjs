import Error from "./types/helper/Error.mjs";
import Download from "systemx-common/download.mjs";
import {default as Thumbnail, getImageSize} from "systemx-common/thumbnail.mjs";
import query from "./ingress/graphql/cms.mjs";
import config from "./config.mjs";
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
export const CleanEmbeddingHTML = html => html.replace("http://","https://")
	.replace("<iframe ","<lazy-iframe ")
	.replace("</iframe>","</lazy-iframe>")
	.replace(/<script.*<\/script>/,"");

export const forceHTTPS = href => href.replace("http://","https://")
	.replace(/^\/\//,"https://");

export const escapeHTML = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
	forceHTTPS = forceHTTPS;
	CleanEmbeddingHTML = CleanEmbeddingHTML;
	download = async url => {
		if(!url){return null;}
		const {filePath, htmlPath} = this.hints.getFilePath(url);
		await Download(url,filePath);
		return htmlPath;
	};
	getBackendLink = context => {
		if(!context){return "";}
		const entryContext = context.getEntryContext();
		const link = `${entryContext.cms.endPoint.origin}/admin/entries/${entryContext.model.typeHandle}/${entryContext.model.id}-${entryContext.model.slug}`;
		return link;
	};
	getEntryContext = () => this?.parentContext?.parentContext ? this.parentContext.getEntryContext() : this;
	downloadWithThumb = async (url, imageSize) => {
		if(this.isMock){ return {thumbHtmlPath: url, thumbSize: {width: 128, height: 128}, htmlPath: url};}
		const {filePath, htmlPath, thumb} = this.hints.getFilePath(url);
		const thumbHtmlPath = thumb.htmlPath;
		await Download(url,filePath);
		if(this.hints.shouldMakeThumbnail(filePath)){
			const maxV = imageSize > 100 ? 2048 : imageSize > 66 ? 1024 : imageSize > 35 ? 512 : 320;
			await Thumbnail(filePath,thumb.filePath,maxV,maxV);
			const thumbSize = await getImageSize(thumb.filePath);
			return {thumbHtmlPath, thumbSize, htmlPath};
		}else{
			return {htmlPath};
		}
	};
	EditorialError = {
		render: ({ ...args }) => Error.render({
			...args,
			isEditorial: true,
			title: "Editorial action required",
			type: args.type || this.type
		}, this)
	};
	Error = {
		render: ({ ...args }) => Error.render({
			...args,
			type: args.type || this.type
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
		this.download = config.downloadMedia
			? parentContext?.download || this.download
			: url => url;
		this.downloadWithThumb = config.downloadMedia
			? parentContext?.downloadWithThumb || this.downloadWithThumb
			: url => {return {thumbHtmlPath: url, htmlPath: url};};
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
