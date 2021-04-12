import { gql, request } from "graphql-request";
import { loadContentTypes } from "./types.mjs";
const globalFragments = {
	asset: `
		height
		url
		width
		...on s3_Asset {
			creativeCommonsTerms: rechtemodule
			license: lizenzart
			source: quelle
		}
	`
};
const globalTypes = {
	get Entry() {
		return `
			__typename
			dateUpdated
			id
			title
			uid
			uri
		`;
	}
};
export const getContext = async () => {
	const contentTypes = await loadContentTypes();
	const cms = {
		fragments: globalFragments,
		types: globalTypes
	};
	for (const [, module] of contentTypes.entries()) {
		for (const [key, getValue] of module.default.queries) {
			if (Object.hasOwnProperty.call(cms.types, key)) {
				continue;
			}
			Object.defineProperty(cms.types, key, {
				get: () => getValue(cms)
			});
		}
	}
	return cms;
};
const maybeWrap = (query, enabled) => enabled
	? `{ ${query} }`
	: query;
export default (queryFunction, {
	raw
} = {}) => request("https://lasub-dev.test-dilewe.de/api", gql([
	maybeWrap(queryFunction(globalTypes, globalFragments), !raw)
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]));
