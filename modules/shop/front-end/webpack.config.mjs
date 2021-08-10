import CopyPlugin from "copy-webpack-plugin";
import ExtractCSSPlugin from "mini-css-extract-plugin";
import { fileURLToPath } from "url";
import HTMLPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, "src");
const dev = process.env.NODE_ENV === "development";
export default {
	devServer: {
		contentBase: path.join(root, "assets"),
		historyApiFallback: true
	},
	entry: path.join(src, "index.mjs"),
	module: {
		rules: [{
			include: src,
			test: /\.mjs$/,
			use: "babel-loader"
		}, {
			include: src,
			test: /\.css$/,
			use: [
				dev
					? "style-loader"
					: ExtractCSSPlugin.loader,
				{
					loader: "css-loader",
					options: {
						importLoaders: 1,
						modules: {
							exportLocalsConvention: "camelCase",
							localIdentName: dev
								? "[name]-[local]-[hash:base64:5]"
								: "[hash:base64:5]"
						},
						sourceMap: true
					}
				},
				"postcss-loader"
			]
		}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			React: "react"
		}),
		new HTMLPlugin({
			lang: "de",
			meta: {
				charset: {
					charset: "utf-8"
				},
				viewport: "width=device-width, initial-scale=1, shrink-to-fit=no"
			},
			template: path.join(src, "index.html")
		}),
		new CopyPlugin({
			patterns: [{
				from: "assets",
				to: "assets"
			}]
		}),
		new ExtractCSSPlugin()
	],
	resolve: {
		alias: {
			components: path.join(src, "components"),
			contexts: path.join(src, "contexts")
		}
	}
};
