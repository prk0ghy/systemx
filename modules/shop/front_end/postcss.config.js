const path = require("path");
module.exports = {
	plugins: [
		["postcss-inject", {
			cssFilePath: "styles/breakpoints.css"
		}],
		["postcss-import", {
			resolve(importString) {
				const replacements = [
					["cache", path.join(process.cwd(), ".cache/fonts")],
					["styles", path.join(process.cwd(), "styles")]
				];
				for (const [prefix, targetPath] of replacements) {
					const needle = `~${prefix}`;
					if (importString.startsWith(needle)) {
						return importString.replace(needle, targetPath);
					}
				}
				return importString;
			}
		}],
		"postcss-nesting",
		"postcss-custom-media",
		"autoprefixer",
		"cssnano"
	]
};
