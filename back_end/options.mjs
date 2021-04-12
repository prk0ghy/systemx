import minimist from "minimist";
const argv = minimist(process.argv.slice(2));
const options = {
	httpPort: 8042,
	openBrowser: false,
	skipNetwork: false,
	startServer: false,
	useCache: false
};
for (const key in options) {
	const optionName = key.replace(/[A-Z]+/g, $1 => `-${$1.toLowerCase()}`);
	if (Object.hasOwnProperty.call(argv, optionName)) {
		options[key] = argv[optionName];
	}
}
export default options;
