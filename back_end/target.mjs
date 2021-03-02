import fs   from 'fs';

import * as css from './css.mjs';
import * as js  from './js.mjs';
import * as ressources from './ressources.mjs';

const fsp = fs.promises;

function fileExtension(filename){
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

async function getHead(targetName){
	const cssContent = await css.get();
	const cssFilename = "web/"+targetName+"/res/main.css";
	await fsp.writeFile(cssFilename,cssContent);

	const jsContent  = await js.get();
	const jsFilename = "web/"+targetName+"/res/main.js";
	await fsp.writeFile(jsFilename,jsContent);

	let ret = '';
	ret += "	<style>\n"+(await css.getInline())+"\n	</style>\n";
	ret += "	<link rel=\"stylesheet\" type=\"text/css\" href=\"res/main.css\"/>\n";
	ret += "	<script defer type=\"text/javascript\" src=\"res/main.js\"></script>\n";

	return ret;
}

async function renderFile(source,destination,targetName){
	const tbuf = await fsp.readFile(source);
	const head = await getHead(targetName);
	const html = tbuf.toString().replace("</head>",head+"\n</head>");
	await fsp.writeFile(destination,html);
}

async function copyDir(source,destination,targetName){
	try { await fsp.mkdir(destination); } catch(e){/* Fails if dir already exists */}
	const filenames = await fsp.readdir(source);
	let proms = [];

	for(let k in filenames){
		const name = filenames[k];
		try {
			const s = await fsp.stat(source+'/'+name);
			if(s.isFile()){
				const ext = fileExtension(source+'/'+name).toLowerCase();
				if(ext === 'html'){
					proms.push(renderFile(source+'/'+name,destination+'/'+name,targetName));
				}else{
					proms.push(fsp.copyFile(source+'/'+name,destination+'/'+name));
				}
			}else if(s.isDirectory()){
				proms.push(copyDir(source+'/'+name,destination+'/'+name,targetName));
			} // Ignore everything else
		}catch(e){/* If we can't stat then just skip */}
	}
	return Promise.all(proms);
}

async function copyAssets(destination){
	const assetDirs = await ressources.getAssetDirectories();
	let proms = [];
	assetDirs.forEach((dir) => {
		proms.push(copyDir(dir,destination));
	});
	return Promise.all(proms);
}

export async function build(targetName){
	try { fs.mkdirSync("web");                   }catch(e){/* Fails if dir already exists */}
	try { fs.mkdirSync("web/"+targetName);       }catch(e){/* Fails if dir already exists */}
	try { fs.mkdirSync("web/"+targetName+'/res');}catch(e){/* Fails if dir already exists */}
	/* If any of those fail for other reasons, then we will catch that later when we
	 * actually try and write out some files.
	 */
	await copyDir("tests/instrumentalisierung","web/"+targetName,targetName);
	await copyAssets("web/"+targetName+'/res');
}
