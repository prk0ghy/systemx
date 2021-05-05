import { loadContentTypes } from "./types.mjs";
import { getContext as getCMSContext } from "./cms.mjs";
import Error from "./types/helper/Error.mjs";
import RenderingContext from "./RenderingContext.mjs";
const cmsContext = await getCMSContext();
const contentTypes = await loadContentTypes();
const warnedContentTypes = new Set();
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
		return contentType.render(mappedModel, new RenderingContext({
			hints,
			model: mappedModel,
			parentContext: context
		}));
	}
	if (!warnedContentTypes.has(type)) {
		console.warn(`Content type "${type}" is currently not supported.`);
		warnedContentTypes.add(type);
	}
	return Error.render({
		message: `This content type is not supported yet.`,
		title: "Unsupported content type",
		type
	}, context);
};
