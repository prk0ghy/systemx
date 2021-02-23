import * as target  from './backend/target.mjs';
import * as options from './backend/options.mjs';
import opn from 'opn';

(async()=>{
	await options.parse(process.argv.slice(2));
	const cTarget = "lasub";
	await target.build(cTarget);
	if(options.openBrowser){
		const path = "file://"+process.cwd()+"/web/"+cTarget+"/instrumentalisierung.html";
		console.log("Opening "+path);
		opn(path);
	}
})();
