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
	siteName: "Lasub",
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
	portalHttpPort: 8020,
	trackingHttpPort: 9090,
	sessionCookie: "Portal_Session_Token",
	portalRegisterEmailRequired: false,
	usesStartpageReference: true,
	openBrowser: false,
	skipNetwork: false,
	mailFrom: "test@dilewe.de",
	startServer: false,
	startShop: false,
	slackToken: "",
	slackChannel: "",
	startTracking: false,
	storagePath: ".systemx/storage",
	title: "Lasub",
	targets: {
		lasub: {
			graphqlEndpoint: "https://lasub.dilewe.de/api",
			httpPort: 8042,
			favicon: "lasub",
			disallowRobots: true
		},
		juramuseum: {
			disableMarkers: true,
			favicon: "juramuseum",
			graphqlEndpoint: "https://systemx-jura-museum.test-dilewe.de/api",
			httpPort: 8049,
			jsVars: {
				galleryWrapAround: false,
				ytCaption: true,
				accessibility: false
			},
			cssVars: {
				backgroundBlue:  "rgba(0,0,0,0)",
				backgroundRed:   "rgba(0,0,0,0)",
				backgroundGreen: "rgba(0,0,0,0)",
				fontContent:     "Franklin",
				fontHeadlines:   "Franklin"
			}
		},
		rdhessen: {
			graphqlEndpoint: "https://rdhessen.test-dilewe.de/api",
			httpPort: 8048,
			favicon: "rdhessen",
			title: "Infoportal Russlanddeutsche in Hessen"
		}
	},
	portal: {
		frontEndVariables: {
			api: {
				endpoint: "http://localhost:8020/portal-user"
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
			imprint: {
				enabled: false
			},
			privacyPage: {
				enabled: false
			},
			termsAndConditions: {
				enabled: false
			},
			userDelete: {
				enabled: false
			},
			passwordReset: {
				enabled: false
			}
		},
		mounts: [
			{
				url: "/vogelinternistik2/",
				localDir: "/var/www/html/dilewe.de/tagungsbaende/web/tagungsbaende/vogelinternistik2/",
				//localDir: "/home/benny/arbeit/systemx/web/tagungsbaende/vogelinternistik2/",
				userGroup: "vogelinternistik2"
			},{
				url: "/resources/",
				localDir: "/var/www/html/dilewe.de/tagungsbaende/web/tagungsbaende/resources/",
				//localDir: "/home/benny/arbeit/systemx/web/tagungsbaende/resources/",
				userGroup: "vogelinternistik2"
			}
		]
	}
};
const mergeObjects = (a,b) => {
	if((a === null) || (b === null)){return;}
	for(const bk in b){
		if(typeof a[bk] === 'object' && a[bk] !== null){
			mergeObjects(a[bk],b[bk]);
		}else{
			a[bk] = b[bk];
		}
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
mergeObjects(options, options?.targets[currentTarget]);
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
