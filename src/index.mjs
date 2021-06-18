import options from "./common/options.mjs";
import startSSG from "./ssg/back_end/index.mjs";
import startShop from "./shop/index.mjs";
(async () => {
	await startSSG();
	if (options.startShop) {
		await startShop();
	}
})();
