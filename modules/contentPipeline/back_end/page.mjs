import getHead from "./page_elements/head.mjs";
import options from "../../common/options.mjs";
import { getNavigationHeader, getNavigationMenu } from "./page_elements/navigation.mjs";
export default async function wrapWithApplicationShell(targetName, {
	pageTitle,
	pageURI,
	content
}) {
	return `
		<!doctype html>
		<html lang="de">
			<head>${await getHead(targetName, pageTitle)}</head>
			<body>
				<header>
					<div id="header-left">
						<button aria-label="menu" id="button-navigation"></button>
					</div>
					<div id="header-center">
						${await getNavigationHeader(targetName, pageURI)}
					</div>
					<div id="header-right">
						${options.backLink ? `<a href="${options.backLink}" class="back-button">Zur&uuml;ck</a>` : ""}
						<button id="button-settings"></button>
					</div>
				</header>
				${await getNavigationMenu(targetName, pageURI)}
				${content}
			</body>
		</html>
	`;
}

