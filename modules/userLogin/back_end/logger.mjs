import Options from "../../common/options.mjs";

class Logger {

	constructor() {
		this.info("initialized logger");
		// T O D O : filelogging
	}

	info = (...message) => {
		console.log(`[INFO]: `, ...message);
	};

	debug = (...message) => {
		if (Options.mode === "development") {
			console.log(`[DEBUG]: `, ...message);
		}
	};

	warn = (...message) => {
		console.log(`[WARNING]: `, ...message);
	};

	error = (...message) => {
		console.error(`[ERROR]: `, ...message);
	};

}

export default new Logger();
