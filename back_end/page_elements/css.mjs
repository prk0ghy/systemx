import * as resources from "./resources.mjs";
import autoprefixer from "autoprefixer";
import postCSS from "postcss";

export async function get() {
	return processCSS(await resources.get("css", false));
}

export async function getInline() {
	return resources.get("css", true);
}

async function processCSS(css) {
	const result = postCSS([ autoprefixer ]).process(css);
	result.warnings().forEach(warning => {
		console.warn(warning.toString());
	});
	return result.css;
}
