
import fs from "fs";
import minimist from "minimist";
import os from "os";
import path from "path";
import DefaultTargets from "./defaultTargets.mjs";

// Create a new Constant "argv" that returns a
const argv = minimist(process.argv.slice(2));

const options = {
	absoluteDomain: "http://localhost:3000",
	activeModule: "contentPipeline",
	action: "build",
	configurationPath: ".systemx/settings",
	cleanBuild: false,
	siteName: "Lasub",
	navigationLinks: [],
	verbose: false,
	rethrowErrors: false,
	vgWortRequired: false,
	cssVars: {},
	email: {
		host: "smtp.server.local",
		port: 465,
		username: "test",
		password: "test"
	},
	jsVars: {
		galleryWrapAround: true,
		galleryBackgroundOpacity: 0.95,
		ytCaption: false,
		accessibility: false,
		trackingEndpoint: ""
	},
	favicon: "default",
	disableMarkers: false,
	disallowRobots: false,
	distributionPath: "web",
	downloadMedia: false,
	forceRendering: false,
	httpPort: 8042,
	sessionCookie: "Portal_Session_Token",
	portalRegisterEmailRequired: false,
	skipNetwork: false,
	mailFrom: "test@dilewe.de",
	mode: "production",
	slackToken: "",
	slackChannel: "",
	storagePath: ".systemx/storage",
	title: "Lasub",
	targets: DefaultTargets,
	portal: {
		frontEndVariables: {
			api: {
				endpoint: "https://tagungsbaende.dilewe.de/portal-user"
			},
			burgerMenu: {
				enabled: false
			},
			registration: {
				enabled: false
			},
			shoppingCart: {
				enabled: false
			},
			userDelete: {
				enabled: false
			},
			passwordReset: {
				enabled: false
			}
		},
		mounts: []
	}
};
/* Recursively merge a and b, returning a merged result. Values in b will overwrite
 * what was in a if the keys match.
 */
const mergeObjects = (a,b) => {
	if((a === null) || (b === null)){return a;}
	for(const bk in b){
		if(typeof a[bk] === 'object' && a[bk] !== null){
			a[bk] = mergeObjects(a[bk],b[bk]);
		}else{
			a[bk] = b[bk];
		}
	}
	return a;
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
		mergeObjects(options, configuration);
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
 * For example --mode="development" sets the mode option to development
 */
for (const arg in argv) {
	const optionName = arg.replace(/-[a-z]/g, $1 => `${$1.slice(1).toUpperCase()}`);
	if (Object.hasOwnProperty.call(options, optionName)) {
		options[optionName] = argv[arg];
	}
}
/*
 * Assign target-specific options based on `currentTarget`, by first splitting on "." we allow for unlimited nesting, with each
 * sub-target starting out with it's parents options, but then having it's own options applied on top of that.
 */
currentTarget.split(".").reduce((o,target) => mergeObjects(o, o.targets?.[target]), options);
/*
 * Do some sanity checks
 */
if (options.forceRendering && options.skipNetwork) {
	throw new Error(`Conflicting options \`forceRendering\` and \`skipNetwork\` specified. You can only choose one.`);
}
if (options.downloadMedia && options.skipNetwork) {
	throw new Error(`Conflicting options \`downloadMedia\` and \`skipNetwork\` specified. You can only choose one.`);
}
if (currentTarget && !currentTarget.split(".").reduce((o,t) => o.targets?.[t], options)) {
	throw new Error(`Can't find target ${currentTarget}, please check your spelling and configuration files`);
}
if ((options.startServer || options.cleanBuild) && (!options.graphqlEndpoint || !options.graphqlEndpoint.startsWith("http"))) {
	throw new Error(`No valid GraphQL endpoint specified, maybe an invalid/unknown target?`);
}
export default options;
