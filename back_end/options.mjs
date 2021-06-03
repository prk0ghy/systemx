import minimist from "minimist";

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

// Command-Line arguments have the highest priority

for(const arg in argv){
	const optionName = arg.replace(/-[a-z]/g, $1 => `${$1.slice(1).toUpperCase()}`);
	if (Object.hasOwnProperty.call(options, optionName)) {
		options[optionName] = argv[arg];
	}
}

// Do some sanity checks

if (options.forceRendering && options.skipNetwork) {
	throw new Error(`Conflicting options \`forceRendering\` and \`skipNetwork\` specified. You can only choose one.`);
}
if (options.downloadMedia && options.skipNetwork) {
	throw new Error(`Conflicting options \`downloadMedia\` and \`skipNetwork\` specified. You can only choose one.`);
}
export default options;
