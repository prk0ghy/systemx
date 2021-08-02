import { mkdirp } from "./modules/common/fileSystem.mjs";
import options from "./modules/common/options.mjs";
import startSSG from "./modules/ssg/back_end/index.mjs";
import startShop from "./modules/shop/index.mjs";
(async () => {
	await mkdirp(options.configurationPath);
	await mkdirp(options.distributionPath);
	await mkdirp(options.storagePath);
	const promises = [];
	if (options.startServer) {
		promises.push(startSSG());
	}
	if (options.startShop) {
		promises.push(startShop());
	}
	await Promise.all(promises);
})();
