import fs   from 'fs';

const fsp = fs.promises;

function fileExtension(filename){
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

async function getFromPath(ext,prefix){
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
		const names = await fsp.readdir("frontend/content-types/");
		let ret = '';
		for(let k in names){
			const prefix = "frontend/content-types/"+names[k]+"/";
			ret += await getFromPath(ext,prefix);
		}
		return ret;
	} catch(e){ return "";}
}

async function getFromThemes(ext){
	try {
		const names = await fsp.readdir("frontend/themes/");
		let ret = '';
		for(let k in names){
			const prefix = "frontend/themes/"+names[k]+"/";
			ret += await getFromPath(ext,prefix);
		}
		return ret;
	} catch(e){ return "";}
}

export async function get(extension){
	const theme       = await getFromThemes(extension);
	const contentType = await getFromContentTypes(extension);
	return theme + contentType;
}
