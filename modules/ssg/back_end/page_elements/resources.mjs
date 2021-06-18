import fs from "fs";

const fsp = fs.promises;

function fileExtension(filename) {
	return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
}

function isInline(filename) {
	return filename.indexOf(".inline.") !== -1;
}

async function getFromPath(ext, prefix, inline) {
	try {
		const names = await fsp.readdir(prefix);
		let ret = "";

		for (const name of names.sort()) {
			if(name.substr(0,1) === "."){continue;}
			const filePath = prefix + name;
			if (fileExtension(filePath).toLowerCase() !== ext) {
				continue;
			}
			if (isInline(name) !== inline) {
				continue;
			}
			try {
				const tbuf = await fsp.readFile(filePath);
				ret += "/* Source: /" + filePath + " */\n" + tbuf.toString();
			}
			catch (e) {
				console.log(e);
			}
		}
		return ret;
	}
	catch (e) { return ""; }
}

async function getFromContentTypes(ext, inline) {
	try {
		const names = await fsp.readdir("modules/ssg/front_end/content_types/");
		let ret = "";
		for (const name of names) {
			if(name.substr(0,1) === "."){continue;}
			const prefix = "modules/ssg/front_end/content_types/" + name + "/";
			ret += await getFromPath(ext, prefix, inline);
		}
		return ret;
	}
	catch (e) { return ""; }
}

async function getFromThemes(ext, inline) {
	try {
		const names = await fsp.readdir("modules/ssg/front_end/themes/");
		let ret = "";
		for (const name of names) {
			if(name.substr(0,1) === "."){continue;}
			const prefix = "modules/ssg/front_end/themes/" + name + "/";
			ret += await getFromPath(ext, prefix, inline);
		}
		return ret;
	}
	catch (e) { return ""; }
}

export async function getAssetDirectories() {
	const ret = [];

	try {
		const names = await fsp.readdir("modules/ssg/front_end/themes/");
		for (const name of names) {
			if(name.substr(0,1) === "."){continue;}
			const prefix = "modules/ssg/front_end/themes/" + name + "/";
			ret.push(prefix);
		}
		return ret;
	}
	catch (e) { /* Skip if no themes available */ }

	try {
		const names = await fsp.readdir("modules/ssg/front_end/content_types/");
		for (const name of names) {
			if(name.substr(0,1) === "."){continue;}
			const prefix = "modules/ssg/front_end/content_types/" + name + "/";
			ret.push(prefix);
		}
		return ret;
	}
	catch (e) { /* Skip if no themes available */ }

	return ret;
}

export async function get(extension, inline = false) {
	const theme = await getFromThemes(extension, inline);
	const contentType = await getFromContentTypes(extension, inline);
	return theme + contentType;
}
