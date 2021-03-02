import fs from "fs";

const fsp = fs.promises;

function fileExtension(filename) {
	return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
}
function isInline(filename) {
	return filename.indexOf(".inline.") != -1;
}

async function getFromPath(ext, prefix, inline) {
	try {
		const names = await fsp.readdir(prefix);
		let ret = "";

		for (const k in names.sort()) {
			const name = names[k];
			const filePath = prefix + name;
			if (fileExtension(filePath).toLowerCase() !== ext) {
				continue;
			}
			if (isInline(name) != inline) {
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
	catch (e) {
		return "";
	}
}

async function getFromContentTypes(ext, inline) {
	try {
		const names = await fsp.readdir("front_end/content-types/");
		let ret = "";
		for (const k in names) {
			const prefix = "front_end/content-types/" + names[k] + "/";
			ret += await getFromPath(ext, prefix, inline);
		}
		return ret;
	}
	catch (e) {
		return "";
	}
}

async function getFromThemes(ext, inline) {
	try {
		const names = await fsp.readdir("front_end/themes/");
		let ret = "";
		for (const k in names) {
			const prefix = "front_end/themes/" + names[k] + "/";
			ret += await getFromPath(ext, prefix, inline);
		}
		return ret;
	}
	catch (e) {
		return "";
	}
}

export async function getAssetDirectories() {
	const ret = [];

	try {
		const names = await fsp.readdir("front_end/themes/");
		for (const k in names) {
			const prefix = "front_end/themes/" + names[k] + "/";
			ret.push(prefix);
		}
		return ret;
	}
	catch (e) { /* Skip if no themes available */ }
	try {
		const names = await fsp.readdir("front_end/content-types/");
		for (const k in names) {
			const prefix = "front_end/content-types/" + names[k] + "/";
			ret.push(prefix);
		}
		return ret;
	}
	catch (e) { /* Skip if no themes available */ }

	return ret;
}

export async function get(extension, inline) {
	if (inline === undefined) {
		inline = false;
	}
	const theme = await getFromThemes(extension, inline);
	const contentType = await getFromContentTypes(extension, inline);
	return theme + contentType;
}