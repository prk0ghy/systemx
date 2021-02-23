import fs   from 'fs';

const fsp = fs.promises;

function fileExtension(filename){
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

async function getFromPath(ext,contentType,prefix){
	try {
		const names = await fsp.readdir(prefix);
		let ret = '';

		for(let k in names.sort()){
			const name = names[k];
			const filePath = prefix+name;
			if(fileExtension(filePath).toLowerCase() !== ext){continue;}
			try {
				const tbuf = await fsp.readFile(filePath);
				ret += "/* Source: /"+filePath+" */\n" + tbuf.toString();
			} catch(e){console.log(e);}
		}

		return ret;
	} catch(e){return "";}
}

async function getFromContentTypes(ext){
	try {
		const names = await fsp.readdir("content-types/");
		let ret = '';
		for(let k in names){
			const prefix = "content-types/"+names[k]+"/fe/";
			ret += await getFromPath(ext,names[k],prefix);
		}
		return ret;
	} catch(e){ return "";}
}

async function getFromThemes(ext){
	try {
		const names = await fsp.readdir("themes/");
		let ret = '';
		for(let k in names){ 
			const prefix = "themes/"+names[k]+"/fe/";
			ret += await getFromPath(ext,names[k],prefix);
		}
		return ret;
	} catch(e){ return "";}
}

export async function get(extension,targetName){
	const theme = await getFromThemes(extension);
	const contentType = await getFromContentTypes(extension);
	return theme + contentType;
}
