import fs from 'fs';
let config     = {};

const getHostname = host => {
	const io = host.indexOf(':');
	if(io < 0){return host;}
	return host.substr(0,io);
}

export const makeid = length => {
	let result           = '';
	let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const prefixUrl = url => {
	return '/'+config['prefix']+url;
}

export const absoluteUrl = url => {
	return config['baseurl'] + prefixUrl(url);
}
export const get = key => {
	return config[key];
}
export const getProduct = key => {
	if(config.products === undefined){return undefined;}
	return config.products[key];
}

export const getOrigin = ctx => {
	const hostname = getHostname(ctx.headers.host);
	const origin = get('origin');
	if(origin !== undefined){
		if(origin[hostname] !== undefined){return origin[hostname];}
		if(origin['*']      !== undefined){return origin['*'];}
	}
	return null;
};

export const printConfig = () => {
	console.log(config);
};

(() => {
	let ddata = fs.readFileSync('shop/data/default_config.json');
	config = JSON.parse(ddata);

	if (fs.existsSync('local_config.json')) {
		let ldata = fs.readFileSync('local_config.json');
		config = {
			...config,
			...JSON.parse(ldata)
		};
	}
})();


