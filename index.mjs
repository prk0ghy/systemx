import { getDistributionPath } from "./modules/common/paths.mjs";
import { mkdirp } from "./modules/common/fileSystem.mjs";
import options from "./modules/common/options.mjs";
import startSSG from "./modules/ssg/back_end/index.mjs";
import startShop from "./modules/shop/index.mjs";
(async () => {
	await mkdirp(".storage");
	await mkdirp(await getDistributionPath());
	await startSSG();
	if (options.startShop) {
		await startShop();
	}
})();
