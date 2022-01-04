import { getNavigationHeader } from "./navigation.mjs";
import options from "../../../../../common/options.mjs";

const getEditLink = entry => {
	const craftPrefix = options.graphqlEndpoint.substring(0,options.graphqlEndpoint.lastIndexOf("/"));
	const type = entry.__typename.substring(0,entry.__typename.indexOf("_"));
	const editLink = `${craftPrefix}/admin/entries/${type}/${entry.id}`;
	return editLink;
};

const getHeader = async (targetName, pageURI, entry) => {
	const editLink = !options.cleanBuild && getEditLink(entry);
	return `
		<div id="header-left">
			<button aria-label="menu" id="button-navigation"></button>
		</div>
		<div id="header-center">
			${await getNavigationHeader(targetName, pageURI)}
		</div>
		<div id="header-right">
			${editLink ? `<a href="${editLink}" class="edit-button" title="Seite Bearbeiten">Seite Bearbeiten</a>` : ""}
			${options.backLink ? `<a href="${options.backLink}" class="back-button">Zur&uuml;ck</a>` : ""}
			<button id="button-settings"></button>
		</div>
	`;
};
export default getHeader;
