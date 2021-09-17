import { gql } from "graphql-request";
import loadModules from "../../common/loadModules.mjs";
import request from "./rateLimiting.mjs";
import options from "../../common/options.mjs";
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
	asset: ({ introspection }) => `
		height
		url
		width
		mimeType
		focalPoint
		...on ${introspection.assetType} {
			creativeCommonsTerms: rechtemodule
			license: lizenzart
			source: quelle
			creator: urheber
			description: beschreibung
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
			...on inhaltsbausteine_embeddedVideoAudio_BlockType {
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
	`)
};
/**
* Sends a custom introspection query to the server, then returns an object that allows for high-level checks.
* This, for instance, can be used to check whether or not a certain type exists.
*/
export const introspectCraft = async () => {
	const result = await query(() => `
		__schema {
			types {
				name
			}
		}
	`);
	const exists = typeName => Boolean(result.__schema.types.find(type => type.name === typeName));
	const coalesce = (...types) => types.length
		? types
			.map(typeName => ({
				exists: exists(typeName),
				typeName
			}))
			.reduce((resultA, resultB) => {
				if (resultA.exists) {
					return resultA.typeName;
				}
				else if (resultB.exists) {
					return resultB.typeName;
				}
				throw new Error("Asset type could not be determined.");
			})
		: null;
	return {
		assetType: coalesce("s3_Asset", "dateien_Asset"),
		exists
	};
};
/* Mock introspection function to be used with automated tests. */
export const introspectMock = async () => {
	return {
		assetType: "dateien_Asset",
		exists: true
	};
};
const maybeWrap = (query, enabled) => enabled
	? `{ ${query} }`
	: query;
const endPoint = new URL(options.graphqlEndpoint);
const types = {};
/*
* CraftCMS hard-codes the origin into all URLs which leads to funky behavior.
* In order to avoid this, we remove the origin from all URLs.
*/
const removeOriginFromURLs = response => JSON.parse(JSON.stringify(response).split(`${endPoint.origin}/`).join("/"));
const query = async (queryFunction, {
	raw
} = {}) => request(endPoint, gql([
	maybeWrap(await queryFunction(types, globalFragments), !raw)
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]))
	.then(removeOriginFromURLs);
export default query;
export const getContext = async introspect => {
	const contentTypes = await loadModules("modules/ssg/back_end/types/content");
	const cms = {
		fragments: {},
		introspection: await introspect(),
		endPoint,
		types
	};
	for (const [, {
		module
	}] of contentTypes.entries()) {
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
