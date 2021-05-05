import minimist from "minimist";
const argv = minimist(process.argv.slice(2));
const options = {
	forceRendering: false,
	httpPort: 8042,
	openBrowser: false,
	skipNetwork: false,
	startServer: false
};
for (const key in options) {
	const optionName = key.replace(/[A-Z]+/g, $1 => `-${$1.toLowerCase()}`);
	if (Object.hasOwnProperty.call(argv, optionName)) {
		options[key] = argv[optionName];
	}
}
if (options.forceRendering && options.skipNetwork) {
	throw new Error(`Conflicting options \`forceRendering\` and \`skipNetwork\` specified. You can only choose one.`);
}
export default options;
