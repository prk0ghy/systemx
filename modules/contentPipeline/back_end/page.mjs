import getHead from "./page_elements/head.mjs";
import getHeader from "./page_elements/header.mjs";
import { getNavigationMenu } from "./page_elements/navigation.mjs";
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
				<header>${await getHeader(targetName, pageURI)}</header>
				${await getNavigationMenu(targetName, pageURI)}
				${content}
			</body>
		</html>
	`;
}

