import { request, gql } from "graphql-request";
import options from "../options.mjs";
const navigationCache = new Map();
/*
* Requests all data needed to build the navigation from the server, given a target.
*/
export const loadNavigation = async target => {
	const result = await request(options.graphqlEndpoint, gql([`
		fragment entriesFields on inhalt_inhalt_Entry {
			id
			title
			uri
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
						}
					}
				}
			}
		}
		query {
			entries(typeId: 10, status: "live", level: 1) {
				...recurseEntries
			}
		}
	`]));
	const fixLinks = entries => {
		if (entries === null) {
			return null;
		}
		for (const child of entries) {
			if (child.uri) {
				child.uri = `/${child.uri}/index.html`;
			}
			fixLinks(child?.children);
		}
		return entries;
	};
	navigationCache.set(target, fixLinks(result.entries));
};
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
/*
* Retrieves information about the current, next and previous entry.
*/
const getPageData = (target, pageURL) => {
	const data = navigationCache.get(target);
	const flattened = flattenData(data);
	const i = flattened.findIndex(page => page.uri === pageURL);
	return {
		current: flattened[i],
		next: flattened[i + 1],
		previous: flattened[i - 1]
	};
};
/*
* Returns the HTML for our navigation header.
*/
export const getNavigationHeader = async (target, pageURL) => {
	const data = getPageData(target, pageURL);
	const title = data.current?.title || "Lasub";
	const previousTitle = data.previous?.title || "";
	const previousURL = data.previous?.uri;
	const nextTitle = data.next?.title || "";
	const nextURL = data.next?.uri;
	const previousTag = data.previous
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
const buildNavigationMenuEntry = (entry, pageURL) => {
	const ulContent = entry.children
		? entry.children
			.map(entry => buildNavigationMenuEntry(entry, pageURL))
			.join("")
			.trim()
		: "";
	const childrenHTML = ulContent.length
		? `<ul>${ulContent}</ul>`
		: "";
	return `
		<li${pageURL === entry.uri ? ` class="active"` : ""} page-id="${entry.id}">
			<a href="${entry.uri}" page-url="${pageURL}">${entry.title}</a>
			${childrenHTML}
		</li>
	`;
};
/*
* Returns the HTML four our navigation menu.
*/
export const getNavigationMenu = async (target, pageURL) => {
	if (!navigationCache.has(target)) {
		return `<h1>Error loading navigation</h1>`;
	}
	const navigationContent = navigationCache
		.get(target)
		.map(entry => buildNavigationMenuEntry(entry, pageURL))
		.join("");
	return `
		<aside id="navigation" style="display:none;">
			<nav>
				<ul>${navigationContent}</ul>
			</nav>
		</aside>
	`;
};
