import fs from "fs";
import minimist from "minimist";
import os from "os";
import path from "path";
const argv = minimist(process.argv.slice(2));
const options = {
	absoluteDomain: "http://localhost:3000",
	configurationPath: ".systemx/settings",
	cleanBuild: false,
	cssVars: {},
	jsVars: {
		galleryWrapAround: true,
		galleryBackgroundOpacity: 0.95,
		ytCaption: false,
		accessibility: false
	},
	favicon: "default",
	disableMarkers: false,
	disallowRobots: false,
	distributionPath: "web",
	downloadMedia: false,
	forceRendering: false,
	httpPort: 8042,
	portalHttpPort: 8020,
	sessionCookie: "Portal_Session_Token",
	portalRegisterEmailRequired: false,
	openBrowser: false,
	skipNetwork: false,
	mailFrom: "test@dilewe.de",
	startServer: false,
	startShop: false,
	storagePath: ".systemx/storage",
	targets: {
		lasub: {
			graphqlEndpoint: "https://lasub.dilewe.de/api",
			httpPort: 8042,
			favicon: "lasub",
			disallowRobots: true
		}
	},
	portal: {
		mounts: [
			{
				url: "/lasub/kapitel1/",
				localDir: "/home/benny/arbeit/systemx/web/lasub",
				userGroup: "lasub"
			},{
				url: "/lasub/",
				localDir: "/home/benny/arbeit/systemx/web/lasub",
				userGroup: "lasub"
			}
		]
	}
};
/*
* The last argument is the current target.
* If nothing is specified, fall back to `lasub`
*/
export const currentTarget = argv._.length
	? argv._[argv._.length - 1]
	: "lasub";
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
		/* If we can't read/parse the file, then we just continue */
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
loadConfigurationFile(path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"), "systemx.conf"));
loadConfigurationFile(`${os.homedir()}/.systemx.conf`);
loadConfigurationDirectory(`${os.homedir()}/.systemx.d`);
/*
* Environment variables can override configuration files
*/
for (const env in process.env) {
	const prefix = "SYSTEMX_";
	if(!env.startsWith(prefix)) {
		continue;
	}
	/* Remove the prefix */
	const envnp = env.slice(prefix.length);
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
* Assign target-specific options based on `currentTarget`
*/
Object.assign(options, options, options?.targets[currentTarget]);
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
