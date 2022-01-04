import { convertCraftURLToURI } from "../target.mjs";
import { getNavigation } from "../../../ingress/ingress.mjs";
import options from "../../../../../common/options.mjs";

/* Returns the first part of a craft uri, which can be used to determine the siteId */
const getUriPrefix = uri => String(uri).substring(0,1 + String(uri).indexOf("/",1));
const findSiteId = (uri, sites) => sites[getUriPrefix(uri)] || sites[Object.keys(sites)[0]];
const enforceLeadingSlash = uri => String(uri).charAt(0) === "/" ? uri : `/${uri}`;

/*
 * Retrieves information about the current, next and previous entry.
 */
const getPageData = async pageURI => {
	const data = await getNavigation();
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
export const getNavigationHeader = async pageURI => {
	const data          = await getPageData(pageURI);
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
			.map(entry => buildNavigationMenuEntry(entry, pageURI, curSiteId))
			.join("")
			.trim()
		: "";
	const childrenHTML = ulContent.length
		? `<ul>${ulContent}</ul>`
		: "";
	//console.log(`${(pageURI === entry.uri) ? "TRUE" : "FALSE"} pageURI: '${pageURI}' == '${entry.uri}' && ${curSiteId}`);
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
export const getNavigationMenu = async uri => {
	const data = await getNavigation();
	const pageURI = enforceLeadingSlash(uri);
	const curSiteId = findSiteId(pageURI, data.sites);
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
