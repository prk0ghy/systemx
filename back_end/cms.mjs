import { request, gql } from "graphql-request";
const scope = {
	entry: `
		__typename
		id
		title
		uri
	`,
	video: `
		__typename
		caption: videoUnterschrift
		files: datei {
			url
		}
		isAutoPlay: autoplay
		isFree: freiesVideo
		isNumbered: nummerierung
		poster: posterbild {
			url
		}
	`
};
export default queryFunction => request("https://lasub-dev.test-dilewe.de/api", gql([
	`{ ${queryFunction(scope)} }`
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]));
