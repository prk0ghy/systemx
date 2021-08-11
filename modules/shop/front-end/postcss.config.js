const path = require("path");
module.exports = {
	plugins: [
		require("postcss-inject")({
			cssFilePath: "src/breakpoints.css"
		}),
		require("postcss-import")({
			resolve(importString) {
				const replacements = [
					["cache", path.join(process.cwd(), ".cache/fonts")],
					["src", path.join(process.cwd(), "src")],
				];
				for (const [prefix, targetPath] of replacements) {
					const needle = `~${prefix}`;
					if (importString.startsWith(needle)) {
						return importString.replace(needle, targetPath);
					}
				}
				return importString;
			}
		}),
		require("postcss-nesting"),
		require("postcss-custom-media"),
		require("autoprefixer"),
		require("cssnano")
	]
};
