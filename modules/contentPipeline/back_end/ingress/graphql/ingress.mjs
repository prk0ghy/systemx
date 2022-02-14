import GraphQLRequest from "graphql-request";
import options from "../../../../common/options.mjs";

const {
	gql,
	request
} = GraphQLRequest;

/* Returns the first part of a craft uri, which can be used to determine the siteId */
const getUriPrefix = uri => String(uri).substring(0,1 + String(uri).indexOf("/",1));

/*
 * Flattens the page tree into an array.
 */
const flattenData = data => {
	const flattened = [];
	for (const child of data) {
		flattened.push(child);
		if (child.children) {
			flattened.push(...flattenData(child.children));
		}
	}
	return flattened;
};

const findSites = entries => {
	const sites = {};
	for(const entry of entries){
		const prefix  = getUriPrefix(entry.uri);
		sites[prefix] = entry.siteId;
	}
	return sites;
};

const sortEntries = entries => {
	const sites = {};
	/* First we find all the siteIds */
	for(const entry of entries){
		if(entry.siteId){
			sites[entry.siteId] = true;
		}
	}
	/* Then we filter and spread them together, preserving their order but keeping
	 * entries with the same siteId by each other
	 */
	let ret = [];
	for(const site in sites){
		ret = [...ret,...entries.filter(e => e.siteId === (site|0)).map((e,i) => i ? e : {...e, firstForSiteId: true})];
	}
	return ret;
};

let navigationCache = null;
let navigationPromise = null;

/* By using this intermediary we can make sure that we
 * use the cache if available, and if not only trigger
 * a single request to the server.
 */
export const getNavigation = () => {
	if(navigationCache){return navigationCache;}
	if(navigationPromise){return navigationPromise;}
	navigationPromise = getNavigationReal();
	return navigationPromise;
};

const getNavigationReal = async () => {
	const status_filter = options.cleanBuild ? `"live"` : `["disabled","live"]`;
	const result = await request(options.graphqlEndpoint, gql([`
		fragment entriesFields on inhalt_inhalt_Entry {
			id
			title
			title_override
			siteId
			status
			language
			uri
			url
		}
		fragment recurseEntries on inhalt_inhalt_Entry {
			...entriesFields
			children(status: ${status_filter}, level: 2 ) {
				...entriesFields
				children(status: ${status_filter}, level: 3) {
					...entriesFields
					children(status: ${status_filter}, level: 4) {
						...entriesFields
						children(status: ${status_filter}, level: 5) {
							...entriesFields
							children(status: ${status_filter}, level: 6) {
								...entriesFields
							}
						}
					}
				}
			}
		}
		query {
			entries(level: 1, status: ${status_filter}, type: "inhalt", siteId: "*") {
				...recurseEntries
			}
		}
	`]));
	const fixURL   = url => url.split("/").slice(3).join("/");
	const fixLinks = entries => {
		if (!entries){
			return null;
		}
		for (const child of entries) {
			if (child.url) {
				child.uri = `/${fixURL(child.url)}/index.html`;
			} else if (child.uri) {
				child.uri = `/${child.uri}/index.html`;
			}
			fixLinks(child?.children);
		}
		return entries;
	};
	const entries   = sortEntries(fixLinks(result.entries));
	const sites     = findSites(entries);
	const flattened = flattenData(entries);
	const ret = { entries, flattened, sites};
	navigationCache = ret;
	setTimeout(() => { navigationCache = null; }, 10000); // Invalidate cache after 10 seconds
	navigationPromise = false;
	return ret;
};

export const getEntry = async uri => {
	return uri; // Placeholder
};

export const getAllEntries = async () => {
	return null; // Placeholder
};
