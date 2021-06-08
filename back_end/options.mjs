import fs from "fs";
import minimist from "minimist";
import os from "os";
const argv = minimist(process.argv.slice(2));
const options = {
	downloadMedia: false,
	forceRendering: false,
	httpPort: 8042,
	openBrowser: false,
	skipNetwork: false,
	startServer: false,
	targets: {
		altenburg: {
			graphqlEndpoint: "https://altenburg.test-dilewe.de/api",
			httpPort: 8056
		},
		bettermarks: {
			graphqlEndpoint: "https://bm.test-dilewe.de/api",
			httpPort: 8053
		},
		juramuseum: {
			graphqlEndpoint: "https://systemx-jura-museum.test-dilewe.de/api",
			httpPort: 8049
		},
		rdhessen: {
			graphqlEndpoint: "https://rdhessen.test-dilewe.de/api",
			httpPort: 8048
		},
		lasub: {
			graphqlEndpoint: "https://lasub.dilewe.de/api",
			httpPort: 8042
		},
		stifterverband: {
			graphqlEndpoint: "https://stifterverband.test-dilewe.de/api",
			httpPort: 8050
		}
	}
};
/*
* Last argument is the current target, if nothing is specified,
* fall back to `lasub`
*/
export const currentTarget = argv._.length ? argv._[argv._.length - 1] : "lasub";

/*
* Read a JSON-formatted configuration file from `path`,
* then assign its values to the `options` object.
*/
const loadConfigurationFile = path => {
	try {
		const fileContent = fs.readFileSync(path);
		const configuration = JSON.parse(fileContent);
		Object.assign(options, configuration);
	}
	catch {
		/* If we can't read/parse the file then we just continue */
	}
};

/*
* Read every file in a directory, without recursing,
* and then pass each file to `loadConfigurationFile`.
*/
const loadConfigurationDirectory = path => {
	try {
		fs.readdirSync(path)
			.map(fn => `${path}/${fn}`)
			.map(loadConfigurationFile);
	}
	catch {
		/* If we can't read the directory, then we just skip it */
	}
};
loadConfigurationFile("/etc/systemx.conf");
loadConfigurationDirectory("/etc/systemx.d");
loadConfigurationFile(`${os.homedir()}/systemx.conf`);
loadConfigurationDirectory(`${os.homedir()}/systemx.d`);
/*
* Environment variables can override configuration files
*/
for (const env in process.env) {
	if(!env.startsWith("SYSTEMX_")) {
		continue;
	}
	// Remove the prefix
	const envnp = env.slice(8);
	const optionName = envnp.toLowerCase().replace(/_[a-z]/g, $1 => `${$1.slice(1).toUpperCase()}`);
	if (Object.hasOwnProperty.call(options, optionName)) {
		options[optionName] = process.env[env];
	}
}
/*
* Command-line arguments have the highest priority
*/
for (const arg in argv) {
	const optionName = arg.replace(/-[a-z]/g, $1 => `${$1.slice(1).toUpperCase()}`);
	if (Object.hasOwnProperty.call(options, optionName)) {
		options[optionName] = argv[arg];
	}
}
/*
* Assign target specific options based on `currentTarget`
*/
Object.assign(options,options,options?.targets[currentTarget]);
/*
* Do some sanity checks
*/
if (options.forceRendering && options.skipNetwork) {
	throw new Error(`Conflicting options \`forceRendering\` and \`skipNetwork\` specified. You can only choose one.`);
}
if (options.downloadMedia && options.skipNetwork) {
	throw new Error(`Conflicting options \`downloadMedia\` and \`skipNetwork\` specified. You can only choose one.`);
}
if (!currentTarget || !(options?.targets[currentTarget])){
	throw new Error(`Not a valid target \`${currentTarget}\``);
}
if (!options.graphqlEndpoint || !options.graphqlEndpoint.startsWith("http")) {
	throw new Error(`No valid GraphQL endpoint specified, maybe an invalid/unknown target?`);
}
export default options;
