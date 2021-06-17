import options from "./common/options.mjs";
import ssg from "./ssg/back_end/index.mjs";
import shop from "./shop/index.mjs";

(async () => {
    await ssg();
    if(options.startShop){
        await shop();
    }
})();