const path = require("path");
const root = path.resolve(__dirname);
const { i18n } = require("./next-i18next.config");
module.exports = {
	i18n,
	eslint: {
		ignoreDuringBuilds: true
	},
	async rewrites() {
		const src = "/portal-user/:path";
		const dest = `${process.env.endpoint.replace("portal-user", "")}:path`;
		console.log(`proxying: ${src} => ${dest}`);
		console.log(`[API_ENDPOINT]: ${process.env.endpoint}`);
		console.log(`[ENABLE_BURGER_MENU]: ${process.env.enableBurgerMenu}`);
		console.log(`[ENABLE_REGISTRATION]: ${process.env.enableRegistration}`);
		console.log(`[ENABLE_SHOPPING_CART]: ${process.env.enableShoppingCart}`);
		console.log(`[ENABLE_USER_DELETE]: ${process.env.enableUserDelete}`);
		console.log(`[ENABLE_PASSWORD_RESET]: ${process.env.enablePasswordReset}`);
		console.log(`[ENABLE_TOC]: ${process.env.enableToC}`);
		return [
			{
				source: src,
				destination: dest
			}
		];
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
