import * as res from "./resources.mjs";
export async function get() {
	return res.get("js", false);
}
