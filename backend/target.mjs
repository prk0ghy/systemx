import fs   from 'fs';
import path from 'path';
import util from 'util';

import * as css from './css.mjs';
import * as js  from './js.mjs';

const fsp = fs.promises;

export default true;

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

	filenames.forEach(async (name) => {
		const s = await fsp.stat(source+'/'+name);
		if(s.isFile()){
			const ext = fileExtension(source+'/'+name).toLowerCase();
			if(ext == 'html'){
				await renderFile(source+'/'+name,destination+'/'+name,targetName);
			}else{
				await fsp.copyFile(source+'/'+name,destination+'/'+name);
			}
		}else if(s.isDirectory()){
			await copyDir(source+'/'+name,destination+'/'+name,targetName);
		} // Ignore everything else
	});
}

export async function build(targetName){
	try { fs.mkdirSync("web");                   }catch(e){}
	try { fs.mkdirSync("web/"+targetName);       }catch(e){}
	try { fs.mkdirSync("web/"+targetName+'/res');}catch(e){}
	await copyDir("tests/instrumentalisierung","web/"+targetName,targetName);
}
