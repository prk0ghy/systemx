import { gql } from "graphql-request";
import request from "./rateLimiting.mjs";
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
	Entry: `
		__typename
		dateUpdated
		id
		title
		uid
		uri
	`
};
const globalTypeCollections = {
	elements: ({ types }) => `
		inhaltsbausteine {
			__typename
			...on inhaltsbausteine_audioDatei_BlockType {
				${types.inhaltsbausteine_audioDatei_BlockType}
			}
			...on inhaltsbausteine_aufgabe_BlockType {
				${types.inhaltsbausteine_aufgabe_BlockType}
			}
			...on inhaltsbausteine_aufklappkasten_BlockType {
				${types.inhaltsbausteine_aufklappkasten_BlockType}
			}
			...on inhaltsbausteine_download_BlockType {
				${types.inhaltsbausteine_download_BlockType}
			}
			...on inhaltsbausteine_embeddedVideoAudio_BlockType  {
				${types.inhaltsbausteine_embeddedVideoAudio_BlockType}
			}
			...on inhaltsbausteine_galerie_BlockType {
				${types.inhaltsbausteine_galerie_BlockType}
			}
			...on inhaltsbausteine_h5p_BlockType {
				${types.inhaltsbausteine_h5p_BlockType}
			}
			...on inhaltsbausteine_heroimage_BlockType {
				${types.inhaltsbausteine_heroimage_BlockType}
			}
			...on inhaltsbausteine_querslider_BlockType {
				${types.inhaltsbausteine_querslider_BlockType}
			}
			...on inhaltsbausteine_tabulator_BlockType {
				${types.inhaltsbausteine_tabulator_BlockType}
			}
			...on inhaltsbausteine_textMitOhneBild_BlockType {
				${types.inhaltsbausteine_textMitOhneBild_BlockType}
			}
			...on inhaltsbausteine_trennerbild_BlockType {
				${types.inhaltsbausteine_trennerbild_BlockType}
			}
			...on inhaltsbausteine_ueberschrift_BlockType {
				${types.inhaltsbausteine_ueberschrift_BlockType}
			}
			...on inhaltsbausteine_videoDatei_BlockType {
				${types.inhaltsbausteine_videoDatei_BlockType}
			}
		}
	`
};
export const getContext = async () => {
	const contentTypes = await loadContentTypes();
	const cms = {
		fragments: globalFragments,
		typeCollections: {},
		types: globalTypes
	};
	for (const [, module] of contentTypes.entries()) {
		for (const [key, setup] of module.default.queries) {
			if (Object.hasOwnProperty.call(cms.types, key)) {
				continue;
			}
			Object.defineProperty(cms.types, key, {
				get: () => setup.fetch(cms)
			});
		}
	}
	for (const [key, value] of Object.entries(globalTypeCollections)) {
		if (Object.hasOwnProperty.call(cms.typeCollections, key)) {
			continue;
		}
		Object.defineProperty(cms.typeCollections, key, {
			get: () => value(cms)
		});
	}
	return cms;
};
const maybeWrap = (query, enabled) => enabled
	? `{ ${query} }`
	: query;
const endPoint = new URL("https://module-sachsen.dilewe.de/api");
/*
* CraftCMS hard-codes the origin into all URLs which leads to funky behavior.
* In order to avoid this, we remove the origin from all URLs.
*/
const removeOriginFromURLs = response => JSON.parse(JSON.stringify(response).replaceAll(`${endPoint.origin}/`, "/"));
export default (queryFunction, {
	raw
} = {}) => request(endPoint, gql([
	maybeWrap(queryFunction(globalTypes, globalFragments), !raw)
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]))
	.then(removeOriginFromURLs);
