import { request, gql } from "graphql-request";
const scope = {
	entry: `
		title
		typeHandle
		uri
	`
};
export default queryFunction => request("https://lasub-dev.test-dilewe.de/api", gql([
	`{ ${queryFunction(scope)} }`
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]));
