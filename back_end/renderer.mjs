import {
	loadContentTypes,
	loadHelperTypes
} from "./types.mjs";
import Error from "./types/helper/Error.mjs";
import query, { getContext as getCMSContext } from "./cms.mjs";
const cmsContext = await getCMSContext();
const contentTypes = await loadContentTypes();
const helperTypes = await loadHelperTypes();
const warnedContentTypes = new Set();
/*
* Helpers are almost like content types.
* The difference is that they don't appear in the back end.
*/
const helpers = Object.fromEntries([...helperTypes.entries()]
	.map(([name, module]) => [name, module.default]));
/*
* Content types should be able to call `render` without providing their context,
* as it makes content types much easier to use.
*
* Hence, we bind all relevant information to the function such that content-type
* modules become simpler.
*/
const makeContextualizedContentTypes = context => Object.fromEntries([...contentTypes.entries()]
	.map(([name, module]) => {
		const {
			render,
			...rest
		} = module.default;
		return [name, {
			render: model => render.bind(module.default)(model, context),
			...rest
		}];
	}));
/*
* The rendering context is a small set of properties that is useful for debugging.
* Moreover, it also comes with a `render` function that can be used for recursive rendering.
*
* Lastly, the `Error.render` function allows you to log a stack trace in the front end.
*/
const RenderingContext = class {
	cms = cmsContext;
	contentTypes = makeContextualizedContentTypes(this);
	Error = {
		render: ({ ...args }) => Error.render({
			...args,
			type: this.type
		})
	};
	helpers = helpers;
	query = query;
	type = null;
	constructor(model, parentContext = null) {
		this.model = model;
		this.parentContext = parentContext;
		this.type = model.__typename;
	}
	render(model) {
		const context = new RenderingContext(model, this);
		return render(model, context);
	}
}
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
export const render = async (model, context = null) => {
	const { __typename: type } = model;
	const contentType = (() => {
		for (const [key, contentType] of contentTypes) {
			const prototype = contentType.default;
			if ([...(prototype?.queries?.keys() || [])].includes(type)) {
				return prototype;
			}
		}
		return null;
	})();
	if (contentType) {
		if (!contentType.cms) {
			contentType.cms = cmsContext;
		}
		return contentType.render(model, new RenderingContext(context || model));
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
