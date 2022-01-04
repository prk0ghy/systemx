import GraphQLRequest from "graphql-request";
import { convertCraftURLToURI } from "../target.mjs";
import options from "../../../../../common/options.mjs";

const {
	gql,
	request
} = GraphQLRequest;
const navigationCache = new Map();
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

/* Returns the first part of a craft uri, which can be used to determine the siteId */
const getUriPrefix = uri => String(uri).substring(0,1 + String(uri).indexOf("/",1));
const findSiteId = (uri, sites) => sites[getUriPrefix(uri)] || sites[Object.keys(sites)[0]];

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
/*
 * Requests all data needed to build the navigation from the server, given a target.
 */
export const loadNavigation = async target => {
	const result = await request(options.graphqlEndpoint, gql([`
		fragment entriesFields on inhalt_inhalt_Entry {
			id
			title
			title_override
			siteId
			uri
			url
		}
		fragment recurseEntries on inhalt_inhalt_Entry {
			...entriesFields
			children(status: "live", level: 2 ) {
				...entriesFields
				children(status: "live", level: 3) {
					...entriesFields
					children(status: "live", level: 4) {
						...entriesFields
						children(status: "live", level: 5) {
							...entriesFields
							children(status: "live", level: 6) {
								...entriesFields
							}
						}
					}
				}
			}
		}
		query {
			entries(level: 1, status: "live", type: "inhalt", siteId: "*") {
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
	navigationCache.set(target, {
		entries,
		flattened,
		sites
	});
};
/*
 * Retrieves information about the current, next and previous entry.
 */
const getPageData = (target, pageURI) => {
	const data = navigationCache.get(target);
	const url  = convertCraftURLToURI(pageURI);
	const i    = data.flattened.findIndex(page => convertCraftURLToURI(page.url) === url);
	return {
		current:  data.flattened[i],
		next:     data.flattened[i + 1]?.siteId === data.flattened[i]?.siteId && data.flattened[i + 1],
		previous: data.flattened[i - 1]?.siteId === data.flattened[i]?.siteId && data.flattened[i - 1]
	};
};
/*
 * Returns the HTML for our navigation header.
 */
export const getNavigationHeader = async (target, pageURI) => {
	const data          = getPageData(target, pageURI);
	const title         = data.current?.title_override || data.current?.title || options.title || "Lasub";
	const previousTitle = data.previous?.title || "";
	const previousURL   = data.previous?.uri;
	const nextTitle     = data.next?.title || "";
	const nextURL       = data.next?.uri;
	const previousTag   = data.previous
		? "a"
		: "button";
	const nextTag = data.next
		? "a"
		: "button";
	return `
		<${previousTag} id="button-previous" title="${previousTitle}" ${previousURL ? `href="${previousURL}"` : ""}></${previousTag}>
		<h3>${title}</h3>
		<${nextTag} id="button-next" title="${nextTitle}" ${nextURL ? `href="${nextURL}"` : ""}></${nextTag}>
	`;
};
/*
 * Returns the HTML for a single entry for the navigation menu.
 */
const buildNavigationMenuEntry = (entry, pageURI, curSiteId) => {
	const ulContent = entry.children
		? entry.children
			.map(entry => buildNavigationMenuEntry(entry, pageURI))
			.join("")
			.trim()
		: "";
	const childrenHTML = ulContent.length
		? `<ul>${ulContent}</ul>`
		: "";
	return (entry.siteId !== curSiteId) && curSiteId
		? "" : `
		<li${pageURI === entry.uri ? ` class="active"` : ""} page-id="${entry.id}" site-id="${entry.siteId}"${entry.firstForSiteId ? " first-for-site-id" : ""}>
			<a href="${entry.uri}" page-url="${pageURI}" role="treeitem">${entry.title_override || entry.title}</a>
			${childrenHTML}
		</li>
	`;
};
const buildNavigationLink = link => `<li class="config-link"><a href="${link.href}" target="${link.target || "_blank"}">${link.text}</a></li>`;
/*
 * Returns the HTML for the navigation menu.
 */
export const getNavigationMenu = async (target, pageURI) => {
	if (!navigationCache.has(target)) {
		return `<h1>Error loading navigation</h1>`;
	}
	const data = navigationCache.get(target);
	const curSiteId = findSiteId(data,data.sites);
	const navigationContent = data.entries
		.map(entry => buildNavigationMenuEntry(entry, pageURI, curSiteId))
		.join("");
	return `
		<aside id="navigation" style="display:none;">
			<nav role="navigation">
				<ul role="tree">
					${options.navigationLinks.map(buildNavigationLink)}
					${navigationContent}
				</ul>
			</nav>
		</aside>
	`;
};
