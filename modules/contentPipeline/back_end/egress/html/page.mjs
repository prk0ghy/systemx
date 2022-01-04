import getHead from "./page_elements/head.mjs";
import getHeader from "./page_elements/header.mjs";
import { getNavigationMenu } from "./page_elements/navigation.mjs";
export default async function wrapWithApplicationShell(targetName, {
	pageTitle,
	pageURI,
	entry,
	content
}) {
	return `
		<!doctype html>
		<html lang="de">
			<head>
				<title>${pageTitle}</title>
				${await getHead(targetName)}
			</head>
			<body>
				<header>${await getHeader(pageURI, entry)}</header>
				${await getNavigationMenu(pageURI)}
				${content}
			</body>
		</html>
	`;
}

