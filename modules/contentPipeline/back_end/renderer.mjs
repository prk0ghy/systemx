import loadModules from "../../common/loadModules.mjs";
import Error from "./types/helper/Error.mjs";
import { getContext as getCMSContext, introspectMock } from "./cms.mjs";
import RenderingContext from "./renderingContext.mjs";
const warnedContentTypes = new Set([
	/*
	* This content type is handled elsewhere and isn't necessary during rendering.
	* Its only job is to determine which entry is supposed to be the home page.
	*/
]);
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
export const makeRenderer = contentTypes => async (model, context, hints) => {
	const { __typename: type } = model;
	const [contentType, isEntryType] = (() => {
		for (const [, {
			isEntryType,
			module
		}] of contentTypes) {
			const prototype = module.default;
			if ([...(prototype?.queries?.keys() || [])].includes(type)) {
				return [prototype, isEntryType];
			}
		}
		return [];
	})();
	try {
		if (contentType) {
			const { map } = contentType.queries.get(type);
			const effectiveModel = isEntryType && !context.isMock
				? (await context.query(() => `
					entry(id: ${model.id}, siteId: "*") {
						...on ${type} {
							${contentType.queries.get(type).fetch(context.cms)}
						}
					}
				`)).entry || {}
				: model;
			/*
			* Nested content types may have structurally different models.
			* Therefore, they can define a `map` function for each `__typename` in their `queries` section.
			* This allows us to map the result of a query to a known structure prior to rendering it.
			*/
			const mappedModel = map && !context.isMock
				? map(effectiveModel)
				: effectiveModel;
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
	} catch(err){
		console.error(err);
		const msg = err.stack.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\n","<br>");
		return Error.render({
			message: `There was an error while rendering this page, please send this message to your IT department as it might help them fix this issue, thank you in advance!<br><br>${msg}`,
			title: "Exception",
			type
		}, context);
	}
};

export const makeMockRenderer = async (contextOverrides = {}) => {
	const cmsContext   = await getCMSContext(introspectMock);
	const contentTypes = await loadModules("modules/contentPipeline/back_end/types/content");
	const helperTypes  = await loadModules("modules/contentPipeline/back_end/types/helper");
	const globalRender = await makeRenderer(contentTypes);
	const context      = new RenderingContext({
		cms: cmsContext,
		hints: {
			getFilePath: url => {
				const urlObject = new URL(url.startsWith("//") ? `https:${url}` : url);
				const fileName = `${decodeURIComponent(urlObject
					.pathname
					.substr(urlObject.pathname.lastIndexOf("/") + 1)
				)}`;
				const filePath = `media/${fileName}`;
				const htmlPath = filePath;
				const thumb = {
					"filePath": filePath,
					"htmlPath": filePath
				};
				return {filePath, htmlPath, thumb};
			}
		},
		globalRender,
		isMock: true,
		types: {
			content: contentTypes,
			helper: helperTypes
		},
		...contextOverrides
	});
	return (model, hints) => globalRender(model, context, hints);
};
