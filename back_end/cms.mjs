import { gql } from "graphql-request";
import request from "./rateLimiting.mjs";
import { loadContentTypes } from "./types.mjs";
const memoize = fn => {
	const cache = new Map();
	return (...inputs) => {
		const key = JSON.stringify(inputs);
		if (cache.has(key)) {
			return cache.get(key);
		}
		const result = fn(...inputs);
		cache.set(key, result);
		return result;
	};
};
const globalFragments = {
	asset: () => `
		height
		url
		width
		...on s3_Asset {
			creativeCommonsTerms: rechtemodule
			license: lizenzart
			source: quelle
		}
	`,
	elements: memoize(({ types }) => `
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
			...on inhaltsbausteine_tabelle_BlockType {
				${types.inhaltsbausteine_tabelle_BlockType}
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
	`),
	exerciseElements: memoize(({ types }) => `
		elemente_nested {
			...on elemente_nested_embeddedVideoAudio_BlockType {
				${types.elemente_nested_embeddedVideoAudio_BlockType}
			}
			...on elemente_nested_galerie_BlockType {
				${types.elemente_nested_galerie_BlockType}
			}
			...on elemente_nested_h5p_BlockType {
				${types.elemente_nested_h5p_BlockType}
			}
			...on elemente_nested_textMitOhneBild_BlockType {
				${types.elemente_nested_textMitOhneBild_BlockType}
			}
			...on elemente_nested_videoDatei_BlockType {
				${types.elemente_nested_videoDatei_BlockType}
			}
		}
	`)
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
export const getContext = async () => {
	const contentTypes = await loadContentTypes();
	const cms = {
		fragments: {},
		types: globalTypes
	};
	for (const [, module] of contentTypes.entries()) {
		for (const [key, setup] of module.default.queries) {
			if (Object.hasOwnProperty.call(cms.types, key)) {
				continue;
			}
			Object.defineProperty(cms.types, key, {
				get: memoize(() => setup.fetch(cms))
			});
		}
	}
	for (const [key, value] of Object.entries(globalFragments)) {
		if (Object.hasOwnProperty.call(cms.fragments, key)) {
			continue;
		}
		Object.defineProperty(cms.fragments, key, {
			get: memoize(() => value(cms))
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
const removeOriginFromURLs = response => JSON.parse(JSON.stringify(response).split(`${endPoint.origin}/`).join("/"));
export default (queryFunction, {
	raw
} = {}) => request(endPoint, gql([
	maybeWrap(queryFunction(globalTypes, globalFragments), !raw)
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]))
	.then(removeOriginFromURLs);
