import getPackageDirectory from "pkg-dir";
import options from "./options.mjs";
import path from "path";
export const getDistributionPath = async () => {
	const root = await getPackageDirectory();
	const name = options.compliance === "nodejs"
		? "dist"
		: "web";
	return path.resolve(root, name);
};
