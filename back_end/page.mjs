import getHead from "./page_elements/head.mjs";
import getNavigationAside from "./page_elements/navigation.mjs";

async function getHeader(){
	return `
		<header>
			<div id="header-left">
				<button id="button-navigation"></button>
			</div>
			<div id="header-center">
				<button id="button-previous"></button>
				<h3>mPublish Lasub</h3>
				<button id="button-next"></button>
			</div>
			<div id="header-right">
				<button id="button-settings"></button>
			</dif>
		</header>
	`;
}

export default async function wrapWithApplicationShell(targetName, {pageTitle, pageType, content}) {
	return `
		<!DOCTYPE html>
		<html lang="de">
			<head>${await getHead(targetName, pageTitle)}</head>
			<body>
				${await getHeader()}
				${await getNavigationAside(targetName,pageType)}
				<main content-type="${pageType}">${content}</main>
			</body>
		</html>
	`;
}

