import getHead from "./page_elements/head.mjs";
import {getNavigationAside,getNavigationHeader} from "./page_elements/navigation.mjs";

async function getHeader(){
	return `

	`;
}

export default async function wrapWithApplicationShell(targetName, {pageTitle, pageType, pageURL, content}) {
	return `
		<!DOCTYPE html>
		<html lang="de">
			<head>${await getHead(targetName, pageTitle)}</head>
			<body>
				<header>
					<div id="header-left">
						<button id="button-navigation"></button>
					</div>
					<div id="header-center">
						${await getNavigationHeader(targetName,pageType,pageURL)}
					</div>
					<div id="header-right">
						<button id="button-settings"></button>
					</dif>
				</header>
				${await getNavigationAside(targetName,pageType,pageURL)}
				<main content-type="${pageType}">${content}</main>
			</body>
		</html>
	`;
}

