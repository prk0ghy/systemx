import Error from "./types/helper/Error.mjs";
import options from "../../common/options.mjs";
import Download from "../../common/download.mjs";
import {default as Thumbnail, getImageSize} from "../../common/thumbnail.mjs";
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
	download = async url => {
		const {filePath, htmlPath} = this.hints.getFilePath(url);
		await Download(url,filePath);
		return htmlPath;
	};
	downloadWithThumb = async (url, imageSize) => {
		if(this.isMock){ return {thumbHtmlPath: url, thumbSize: {width: 128, height: 128}, htmlPath: url};}
		const {filePath, htmlPath, thumb} = this.hints.getFilePath(url);
		let thumbHtmlPath = thumb.htmlPath;
		await Download(url,filePath);
		if(this.hints.shouldMakeThumbnail(filePath)){
			const maxV = imageSize > 50 ? 2048 : imageSize > 35 ? 1024 : 512;
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
		this.downloadWithThumb = options.downloadMedia
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
