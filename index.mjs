import { mkdirp } from "./modules/common/fileSystem.mjs";
import options from "./modules/common/options.mjs";
import startSSG from "./modules/ssg/back_end/index.mjs";
import startShop from "./modules/portal/back_end/index.mjs";
import startTracking from "./modules/tracking/index.mjs";
import startAdministration from "./modules/administration/index.mjs";
(async () => {
	await mkdirp(options.configurationPath);
	await mkdirp(options.distributionPath);
	await mkdirp(options.storagePath);
	const promises = [];
	if (options.startServer || options.cleanBuild) {
		promises.push(startSSG());
	}
	if (options.startShop) {
		promises.push(startShop());
	}
	console.log(options);
	if (options.startTracking && !options.cleanBuild) {
		promises.push(startTracking());
	}
	if (options.startAdministration) {
		promises.push(startAdministration());
	}
	await Promise.all(promises);
})();
