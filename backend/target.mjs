import fs   from 'fs';

import * as css from './css.mjs';
import * as js  from './js.mjs';

const fsp = fs.promises;

function fileExtension(filename){
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

async function getHead(targetName){
	const cssContent = await css.get(targetName);
	const cssFilename = "web/"+targetName+"/res/main.css";
	await fsp.writeFile(cssFilename,cssContent);

	const jsContent  = await js.get(targetName);
	const jsFilename = "web/"+targetName+"/res/main.js";
	await fsp.writeFile(jsFilename,jsContent);

	let ret = "	<script type=\"text/javascript\" src=\"res/main.js\"></script>\n";
	ret += "	<link rel=\"stylesheet\ type=\"text/css\" href=\"res/main.css\"/>\n";
	return ret;
}

async function renderFile(source,destination,targetName){
	const tbuf = await fsp.readFile(source);
	const head = await getHead(targetName);
	const html = tbuf.toString().replace("</head>",head+"\n</head>");
	await fsp.writeFile(destination,html);
}

async function copyDir(source,destination,targetName){
	const filenames = await fsp.readdir(source);
	try { await fsp.mkdir(destination); } catch(e){}
	let proms = [];

	for(let k in filenames){
		const name = filenames[k];
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
	}
	return Promise.all(proms);
}

export async function build(targetName){
	try { fs.mkdirSync("web");                   }catch(e){}
	try { fs.mkdirSync("web/"+targetName);       }catch(e){}
	try { fs.mkdirSync("web/"+targetName+'/res');}catch(e){}
	await copyDir("tests/instrumentalisierung","web/"+targetName,targetName);
}
