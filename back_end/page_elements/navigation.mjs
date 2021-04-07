import {request, gql} from "graphql-request";

function buildNavigationEntry(entry,pageURL){
	let ul = "";
	if(entry.children !== undefined){
		ul = entry.children.map(buildNavigationEntry).join("").trim();
		if(ul.length > 0){
			ul = `<ul>${ul}</ul>`;
		}
	}
	return `<li${pageURL === "/index.html" ? ' class="active"' : ''}><a href="/${entry.uri}">${entry.title}</a>${ul}</li>`;
}

const navCache = new Map();
export async function loadNavigation(target){
	const result = await request("https://lasub-dev.test-dilewe.de/api", gql([`
	query navigationQuery {
		entries(typeId: 10, status: "live", level: 1) {
			...recurseEntries
		  }
		}

		fragment recurseEntries on inhalt_inhalt_Entry {
		  ...entriesFields
		  children(status: "live", level: 2 ){
			...entriesFields
			children(status: "live", level: 3){
			  ...entriesFields
			  children(status: "live", level: 4){
				...entriesFields
				children(status: "live", level: 5){
				  ...entriesFields
				}
			  }
			}
		  }
		}

		fragment entriesFields on inhalt_inhalt_Entry {
		  title
		  uri
		}
	`]));
	navCache.set(target,result.entries);
}

async function genTestNavigation(pageURL) {
	return `<aside id="navigation" style="display:none;"><nav><ul>
	<li><a href="/index.html">Geschichte - Instrumentalisierung der Vergangenheit</a>
		<ul><li${pageURL === "/index.html" ? ' class="active"' : ''}><a href="/index.html">1. Instrumentalisierung der Vergangenheit</a></li></ul>
	</li>
	<li><a href="/farbkontraste.html">Kunst - Die Welt der Farben</a>
		<ul><li${pageURL === "/farbkontraste.html" ? ' class="active"' : ''}><a href="/farbkontraste.html">2. Farbkontraste</a></li></ul>
	</li>
	<li><a href="/besserleser.html">Deutsch - Sachtexte rund ums Internet besser verstehen</a>
		<ul><li${pageURL === "/besserleser.html" ? ' class="active"' : ''}><a href="/besserleser.html">1. Anleitung f&uuml;r Besserleser</a></li></ul>
	</li>
	<li><a href="/bewegung.html">Physik - Bewegungen von Körpern</a>
		<ul><li${pageURL === "/bewegung.html" ? ' class="active"' : ''}><a href="/bewegung.html">1. Beurteilen von Bewegungen</a></li></ul>
	</li>
</ul></nav></aside>`;
}

async function genNavigation(target,pageURL){
	if(!navCache.has(target)){ return `<h1>Error loading Navigation</h1>`; }
	const nav = navCache.get(target).map((e) => buildNavigationEntry(e,pageURL)).join("");
	return `<aside id="navigation" style="display:none;"><nav><ul>${nav}</ul></aside>`;

}

export default function(target,pageType,pageURL) {
	if(pageType === "testpage"){
		return genTestNavigation(pageURL);
	}else{
		return genNavigation(target,pageURL);
	}
}
