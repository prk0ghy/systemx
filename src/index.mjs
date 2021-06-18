import { mkdirp } from "./common/fileSystem.mjs";
import options from "./common/options.mjs";
import startSSG from "./ssg/back_end/index.mjs";
import startShop from "./shop/index.mjs";
(async () => {
	await mkdirp("dist");
	await startSSG();
	if (options.startShop) {
		await startShop();
	}
})();