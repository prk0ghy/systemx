import * as res from "./resources.mjs";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export async function get() {
	return processCSS(await res.get("css", false));
}

export async function getInline() {
	return res.get("css", true);
}

async function processCSS(css) {
	const result = postcss([ autoprefixer ]).process(css);
	result.warnings().forEach(warn => {
		console.warn(warn.toString());
	});
	return result.css;
}