import * as res from "./resources.mjs";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export async function getProcessed() {
	return processCSS(await res.get("css", false));
}

export async function getInline() {
	return res.get("css", true);
}

/*** PostProcesing CSS ***/
function processCSS(css) {
	return postcss([
		// Add PostCss plugins here
		autoprefixer
	]).process(css).css;
}
