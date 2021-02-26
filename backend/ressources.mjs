import fs   from 'fs';

const fsp = fs.promises;

function fileExtension(filename){
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}
function isInline(filename){
	return filename.indexOf('.inline.') != -1;
}

async function getFromPath(ext,prefix,inline){
	try {
		const names = await fsp.readdir(prefix);
		let ret = '';

		for(let k in names.sort()){
			const name = names[k];
			const filePath = prefix+name;
			if(fileExtension(filePath).toLowerCase() !== ext){continue;}
			if(isInline(name) != inline){continue;}
			try {
				const tbuf = await fsp.readFile(filePath);
				ret += "/* Source: /"+filePath+" */\n" + tbuf.toString();
			} catch(e){console.log(e);}
		}
		return ret;
	} catch(e){return "";}
}

async function getFromContentTypes(ext,inline){
	try {
		const names = await fsp.readdir("frontend/content-types/");
		let ret = '';
		for(let k in names){
			const prefix = "frontend/content-types/"+names[k]+"/";
			ret += await getFromPath(ext,prefix,inline);
		}
		return ret;
	} catch(e){ return "";}
}

async function getFromThemes(ext,inline){
	try {
		const names = await fsp.readdir("frontend/themes/");
		let ret = '';
		for(let k in names){
			const prefix = "frontend/themes/"+names[k]+"/";
			ret += await getFromPath(ext,prefix,inline);
		}
		return ret;
	} catch(e){ return "";}
}

export async function getAssetDirectories(){
	let ret = [];

	try {
		const names = await fsp.readdir("frontend/themes/");
		for(let k in names){
			const prefix = "frontend/themes/"+names[k]+"/";
			ret.push(prefix);
		}
		return ret;
	} catch(e){ /* Skip if no themes available */ }
	try {
		const names = await fsp.readdir("frontend/content-types/");
		for(let k in names){
			const prefix = "frontend/content-types/"+names[k]+"/";
			ret.push(prefix);
		}
		return ret;
	} catch(e){ /* Skip if no themes available */ }

	return ret;
}

export async function get(extension,inline){
	if(inline === undefined){inline = false;}
	const theme       = await getFromThemes(extension,inline);
	const contentType = await getFromContentTypes(extension,inline);
	return theme + contentType;
}
