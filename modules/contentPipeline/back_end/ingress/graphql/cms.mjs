import GraphQLRequest from "graphql-request";
import loadModules from "systemx-common/loadModules.mjs";
import request from "./rateLimiting.mjs";
import options from "systemx-common/options.mjs";

const { gql } = GraphQLRequest;
const globalFragments = {};

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
const endPoint = options.graphqlEndpoint;
const types = {};
/*
* CraftCMS hard-codes the origin into all URLs which leads to funky behavior.
* In order to avoid this, we remove the origin from all URLs.
*/
const origin = options.graphqlEndpoint.substr(0,options.graphqlEndpoint.indexOf("/",8));
const removeOriginFromURLs = response => JSON.parse(JSON.stringify(response).split(`${origin}/`).join("/"));
const query = async (queryFunction, {
	raw
} = {}) => request(endPoint, gql([
	maybeWrap(await queryFunction(types, globalFragments), !raw)
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
])).then(removeOriginFromURLs);

export default query;
export const getContext = async introspect => {
	const contentTypes = await loadModules("./types/content");
	const cms = {
		fragments: {},
		introspection: await introspect(),
		endPoint,
		types
	};
	/* First we need to define the GraphQL query for assets, since this part is included in nearly every contentType */
	cms.fragments.asset = globalFragments.asset = `
		height
		url
		width
		mimeType
		focalPoint
		...on ${cms.introspection.assetType} {
			creativeCommonsTerms: rechtemodule
			license: lizenzart
			source: quelle
			creator: urheber
			description: beschreibung
		}
	`;

	/* Then we determine each contentType available in the system and store a placeholder value for it,
	 * so that we can detect if a contentType depends on another contentType that still has to be initialized */
	let fetchQueue = [];
	for (const [, {
		module
	}] of contentTypes.entries()) {
		for (const [key, setup] of module.default.queries) {
			cms.types[key] = "WRONG_ORDER-aαδω-順-💩";
			fetchQueue.push([key, setup]);
		}
	}

	/* Now we try and actually build the GraphQL queries, checking for the presence of this placeholder string on each iteration
	 * and then trying the contentType in question again in the next loop. */
	let lastLength = fetchQueue.length + 1;
	while(fetchQueue.length){
		if(fetchQueue.length >= lastLength){
			throw new Error("fetchQueue does not shrink, this might be due to globalFragments having circular dependencies within their respective GraphQL fetch methods");
		}
		const workQueue = fetchQueue;
		lastLength = workQueue.length;
		fetchQueue = [];
		for(const [key, setup] of workQueue){
			const temp = setup.fetch(cms);
			if(temp.includes("WRONG_ORDER-aαδω-順-💩")){
				fetchQueue.push([key, setup]);
			}else{
				cms.types[key] = temp;
			}
		}
	}
	cms.fragments.elements = cms.elements = globalFragments.elements = `
	inhaltsbausteine {
		__typename
		${ Object.keys(cms.types).filter(k => k.startsWith("inhaltsbausteine_")).map(k => `...on ${k} { ${cms.types[k]} }`).join(" ") }
	}`;

	return cms;
};
