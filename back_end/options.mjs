import fs from "fs";
import minimist from "minimist";
import os from "os";
const argv = minimist(process.argv.slice(2));
const options = {
	downloadMedia: false,
	forceRendering: false,
	graphqlEndpoint: "https://lasub.dilewe.de/api",
	httpPort: 8042,
	openBrowser: false,
	skipNetwork: false,
	startServer: false
};
/*
* Reads a JSON-formatted configuration file from `path`,
* then assigns its values to the `options` object.
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
* Reads every file in a directory, without recursing it,
* and then passes each file to `loadConfigurationFile`.
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
* Do some sanity checks
*/
if (options.forceRendering && options.skipNetwork) {
	throw new Error(`Conflicting options \`forceRendering\` and \`skipNetwork\` specified. You can only choose one.`);
}
if (options.downloadMedia && options.skipNetwork) {
	throw new Error(`Conflicting options \`downloadMedia\` and \`skipNetwork\` specified. You can only choose one.`);
}
export default options;
