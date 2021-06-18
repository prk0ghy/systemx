import fs from "fs";
import options from "../common/options.mjs";
import path from "path";
let configuration = {};
const getHostname = host => {
	const io = host.indexOf(":");
	return io < 0
		? host
		: host.substr(0, io);
}
export const makeid = length => {
	let result = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
export const prefixUrl = url => "/" + configuration["prefix"] + url;
export const absoluteUrl = url => configuration["baseurl"] + prefixUrl(url);
export const get = key => configuration[key];
export const getProduct = key => configuration.products?.[key];
export const getOrigin = ctx => {
	const hostname = getHostname(ctx.headers.host);
	const origin = get("origin");
	return origin?.[hostname] || origin["*"] || null;
};
export const printConfig = () => console.log(configuration);
(() => {
	let defaultData = fs.readFileSync("modules/shop/data/default_configuration.json");
	configuration = JSON.parse(defaultData);
	const localConfigurationPath = path.join(options.configurationPath, "shop.json");
	if (fs.existsSync(localConfigurationPath)) {
		let localData = fs.readFileSync(localConfigurationPath);
		configuration = {
			...configuration,
			...JSON.parse(localData)
		};
	}
})();
