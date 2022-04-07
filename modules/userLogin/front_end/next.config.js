const path = require("path");
const root = path.resolve(__dirname);
const { i18n } = require("./next-i18next.config");
module.exports = {
	i18n,
	eslint: {
		ignoreDuringBuilds: true
	},
	async rewrites() {
		const src = "/api/portal-user";
		const dest = process.env.apiEndpoint;
		const contentSrc = "/content/:path*";
		const contentDest = `${process.env.contentEndpoint}:path`;
		console.log(`proxying: ${src} => ${dest}`);
		console.log(`proxying: ${contentSrc} => ${contentDest}`);
		return {
			beforeFiles: [
				{
					source: src,
					destination: dest
				},
				{
					source: "/content/:path*",
					destination: "http://localhost:8020/:path*"
				}
			]
		};
	},
	reactStrictMode: true,
	webpack(configuration, { webpack }) {
		configuration.plugins.push(new webpack.ProvidePlugin({
			React: "react"
		}));
		configuration.resolve.alias.components = path.join(root, "components");
		configuration.resolve.alias.contexts = path.join(root, "contexts");
		configuration.resolve.alias.root = root;
		configuration.module.rules
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
