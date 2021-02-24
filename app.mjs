import * as target  from './backend/target.mjs';
import * as options from './backend/options.mjs';
import * as server from './backend/server.mjs';
import opn from 'opn';

(async()=>{
	await options.parse(process.argv.slice(2));
	const cTarget = "lasub";
	await target.build(cTarget);
	if(options.startServer){
			server.start('./web/'+cTarget);
	}
	if(options.openBrowser){
		if(options.startServer){
			opn("http://localhost:8080/");
		}else{
			opn("file://"+process.cwd()+"/web/"+cTarget+"/index.html");
		}
	}
})();
