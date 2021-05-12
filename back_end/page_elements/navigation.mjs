import {request, gql} from "graphql-request";
import options from "../options.mjs";

function buildNavigationEntry(entry,pageURL){
	let ul = "";
	if(entry.children !== undefined){
		ul = entry.children.map((e) => buildNavigationEntry(e,pageURL)).join("").trim();
		if(ul.length > 0){
			ul = `<ul>${ul}</ul>`;
		}
	}
	return `<li${pageURL === entry.uri ? ` class="active"` : ""} page-id="${entry.id}"><a href="${entry.uri}" page-url="${pageURL}">${entry.title}</a>${ul}</li>`;
}

const navCache = new Map();
export async function loadNavigation(target){
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

	function fixLinks(e){
		if(e === null){return null;}
		for(const c of e){
			if(c.uri){c.uri = `/${c.uri}/index.html`;}
			fixLinks(c?.children);
		}
		return e;
	}

	navCache.set(target,fixLinks(result.entries));
}

async function genNavigation(target,pageURL){
	if (!navCache.has(target)) {
		return `<h1>Error loading Navigation</h1>`;
	}
	const nav = navCache.get(target).map(entry => {
		return buildNavigationEntry(entry,`${pageURL}`);
	}).join("");
	return `
		<aside id="navigation" style="display:none;">
			<nav>
				<ul>${nav}</ul>
			</nav>
		</aside>
	`;
}

function getPageDataFlat(data){
	const ret = [];
	if(!data){return ret;}
	for(const c of data){
		ret.push(c);
		if(c.children){
			ret.push(...getPageDataFlat(c.children));
		}
	}
	return ret;
}

function findPageURL(data,pageURL){
	for(let i = 0;i<data.length;i++){
		if(data[i].uri === pageURL){return i;}
	}
	return 0;
}

function findPrev(data,i){
	while(--i >= 0){
		if(!data[i]?.noPrevNextLink){return data[i];}
	}
	return null;
}

function findNext(data,i){
	while(++i < data.length){
		if(!data[i]?.noPrevNextLink){return data[i];}
	}
	return null;
}

function getPageData(target,pageType,pageURL){
	const rawData = (pageType === "testpage") ? testNavigationData : navCache.get(target);
	const data = getPageDataFlat(rawData);
	const i = findPageURL(data,pageURL);
	return {prev: findPrev(data,i), cur: data[i], next: findNext(data,i)};
}

export function getNavigationAside(target,pageType,pageURL){
	if(pageType === "testpage"){
		return genTestNavigation(pageURL);
	}else{
		return genNavigation(target,pageURL);
	}
}

export async function getNavigationHeader(target,pageType,pageURL){
	const d  = getPageData(target,pageType,pageURL);
	const title     = d.cur?.title ? d?.cur?.title : "Lasub";
	const prevTitle = d.prev?.title;
	const prevURL   = d.prev?.uri;
	const nextTitle = d.next?.title;
	const nextURL   = d.next?.uri;
	const prevTag   = d.prev === null ? "button": "a";
	const nextTag   = d.next === null ? "button": "a";
	return `
		<${prevTag} id="button-previous" title="${prevTitle ? prevTitle : ""}" ${prevURL ? `href="${prevURL}"` : ""}></${prevTag}>
		<h3>${title}</h3>
		<${nextTag} id="button-next" title="${nextTitle ? nextTitle : ""}" ${nextURL ? `href="${nextURL}"` : ""}></${nextTag}>
	`;
}
