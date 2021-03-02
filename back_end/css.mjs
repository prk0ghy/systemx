import * as res from "./ressources.mjs";

export async function get() {
	return res.get("css", false);
}
export async function getInline() {
	return res.get("css", true);
}