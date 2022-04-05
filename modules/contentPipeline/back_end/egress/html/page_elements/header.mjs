import { getNavigationHeader } from "./navigation.mjs";
import config from "../../../config.mjs";

const getEditLink = entry => {
	const craftPrefix = config.gqlEndpoint.substring(0,config.gqlEndpoint.lastIndexOf("/"));
	const type = entry?.__typename?.substring(0,entry.__typename.indexOf("_"));
	return type ? `${craftPrefix}/admin/entries/${type}/${entry.id}` : "";
};

const getHeader = async (pageURI, entry) => {
	const editLink = !config.cleanBuild && getEditLink(entry);
	return `
		<div id="header-left">
			<button aria-label="menu" id="button-navigation"></button>
		</div>
		<div id="header-center">
			${await getNavigationHeader(pageURI)}
		</div>
		<div id="header-right">
			${editLink ? `<a href="${editLink}" class="edit-button" title="Seite Bearbeiten">Seite Bearbeiten</a>` : ""}
			${config.backlink ? `<a href="${config.backlink}" class="back-button">Zur&uuml;ck</a>` : ""}
			<button id="button-settings"></button>
		</div>
	`;
};
export default getHeader;
