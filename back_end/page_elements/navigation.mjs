import {request, gql} from "graphql-request";

function buildNavigationEntry(entry){
	let ul = "";
	if(entry.children !== undefined){
		ul = entry.children.map(buildNavigationEntry).join("").trim();
		if(ul.length > 0){
			ul = `<ul>${ul}</ul>`;
		}
	}
	return `<li><a href="/${entry.uri}">${entry.title}</a>${ul}</li>`;
}

async function buildNavigation(){
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

	const nav = result.entries.map(buildNavigationEntry).join("");
	return `<aside id="navigation" style="display:none;"><nav><ul>${nav}</ul></aside>`;
}

const navCache = new Map();
export async function genNavigation(target){
	if(navCache.has(target)){return;}
	console.time("navigation#build");
	const navAside = await buildNavigation();
	navCache.set(target,navAside);
	console.timeEnd("navigation#build");
}

async function genTestNavigation(){
	return `<aside id="navigation" style="display:none;"><nav><ul>
	<li class="active"><a href="/index.html">Geschichte - Instrumentalisierung der Vergangenheit</a>
		<ul><li><a href="/index.html">1. Instrumentalisierung der Vergangenheit</a></li></ul>
	</li>
	<li><a href="/farbkontraste.html">Kunst - Die Welt der Farben</a>
		<ul><li><a href="/farbkontraste.html">2. Farbkontraste</a></li></ul>
	</li>
	<li><a href="/besserleser.html">Deutsch - Sachtexte rund ums Internet besser verstehen</a>
		<ul><li><a href="/besserleser.html">1. Anleitung f&uuml;r Besserleser</a></li></ul>
	</li>
	<li><a href="/bewegung.html">Physik - Bewegungen von Körpern</a>
		<ul><li><a href="/bewegung.html">1. Beurteilen von Bewegungen</a></li></ul>
	</li>
</ul></nav></aside>`;
}

export default function(target,targetType) {
	if(targetType === "testpage"){
		return genTestNavigation();
	}else{
		return navCache.get(target);
	}
}
