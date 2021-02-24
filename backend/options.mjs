import minimist from 'minimist';

export let openBrowser = false;
export let startServer = false;

export async function parse(args){
	const argv = minimist(args);
	if(argv['open-browser'] !== undefined){openBrowser = true;}
	if(argv['start-server'] !== undefined){startServer = true;}
}
