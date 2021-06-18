import fs from "fs";
let configuration = {};
const getHostname = host => {
	const io = host.indexOf(":");
	if(io < 0){return host;}
	return host.substr(0,io);
}
export const makeid = length => {
	let result           = "";
	let characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
	if(origin !== undefined){
		if(origin[hostname] !== undefined){return origin[hostname];}
		if(origin["*"]      !== undefined){return origin["*"];}
	}
	return null;
};
export const printConfig = () => console.log(configuration);
(() => {
	let defaultData = fs.readFileSync("modules/shop/data/default_configuration.json");
	configuration = JSON.parse(defaultData);
	if (fs.existsSync("local_configuration.json")) {
		let localData = fs.readFileSync("local_configuration.json");
		configuration = {
			...configuration,
			...JSON.parse(localData)
		};
	}
})();
