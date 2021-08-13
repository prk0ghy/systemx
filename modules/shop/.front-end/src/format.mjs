import { hyphenated } from "hyphenated";
import HyphenatedDE from "hyphenated-de";
const hyphenate = text => hyphenated(text, {
	language: HyphenatedDE
});
export const H = ({ children }) => children
	? hyphenate(children)
	: null;
export const formatPrice = price => `${price.toFixed(2)}\u{202f}€`.replace(".", ",");
