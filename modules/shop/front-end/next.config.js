const path = require("path");
const root = path.resolve(__dirname);
module.exports = {
	eslint: {
		ignoreDuringBuilds: true
	},
	reactStrictMode: true,
	webpack(configuration, {
		webpack
	}) {
		configuration.plugins.push(new webpack.ProvidePlugin({
			React: "react"
		}));
		configuration.resolve.alias.components = path.join(root, "components");
		configuration.resolve.alias.contexts = path.join(root, "contexts");
		configuration.resolve.alias.root = root;
		const rules = configuration.module.rules
			.find(rule => typeof rule.oneOf === "object")
			.oneOf.filter(rule => Array.isArray(rule.use))
			.forEach(rule => {
				rule.use.forEach(moduleLoader => {
					if (moduleLoader.loader.includes("css-loader") && typeof moduleLoader.options.modules === "object") {
						moduleLoader.options = {
							...moduleLoader.options,
							modules: {
								...moduleLoader.options.modules,
								exportLocalsConvention: "camelCase"
							}
						};
					}
				});
			});
		return configuration;
	}
};
