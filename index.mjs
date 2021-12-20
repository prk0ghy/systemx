import { mkdirp }     from "./modules/common/fileSystem.mjs";
import options        from "./modules/common/options.mjs";
import ContentServer  from "./modules/contentPipeline/back_end/index.mjs";
import UserLogin      from "./modules/userLogin/back_end/index.mjs";
import UserTracking   from "./modules/userTracking/index.mjs";
import Administration from "./modules/administration/index.mjs";

(async () => {
	if(options.verbose){console.log(options);}

	await mkdirp(options.configurationPath);
	await mkdirp(options.distributionPath);
	await mkdirp(options.storagePath);

	switch(options.activeModule){
	case "contentPipeline":
		return await ContentServer(options.action);
	case "userLogin":
		return await UserLogin(options.action);
	case "userTracking":
		return await UserTracking(options.action);
	case "administration":
		return await Administration(options.action);
	}
})();
