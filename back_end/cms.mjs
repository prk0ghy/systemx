import { request, gql } from "graphql-request";
const scope = {
	entry: `
		__typename
		dateUpdated
		id
		title
		uid
		uri
	`,
	video: `
		__typename
		caption: videoUnterschrift
		files: datei {
			url
		}
		isNumbered: nummerierung
		poster: posterbild {
			url
		}
	`,
	header: `
		__typename
		headline: ueberschrift
		isNumbered: nummerierung
	`
};
export default queryFunction => request("https://lasub-dev.test-dilewe.de/api", gql([
	`{ ${queryFunction(scope)} }`
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]));
