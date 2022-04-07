import fs from "fs";
import autoprefixer from "autoprefixer";
import postCSS from "postcss";

const fsp = fs.promises;

const fileExtension = (filename) => {
	return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
};

const isInline = (filename) => {
	return filename.indexOf(".inline.") !== -1;
};

const getFromPath = async (ext, prefix, inline) => {
	try {
		const names = await fsp.readdir(prefix);
		let ret = "";

		for (const name of names.sort()) {
			if(name.substring(0,1) === "."){continue;}
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
};

const getFromContentTypes = async (ext, inline) => {
	try {
		const names = await fsp.readdir("../front_end/content_types/");
		let ret = "";
		for (const name of names) {
			if(name.substring(0,1) === "."){continue;}
			const prefix = "../front_end/content_types/" + name + "/";
			ret += await getFromPath(ext, prefix, inline);
		}
		return ret;
	}
	catch (e) { return ""; }
};

const getFromThemes = async (ext, inline) => {
	try {
		const names = await fsp.readdir("../front_end/themes/");
		let ret = "";
		for (const name of names) {
			if(name.substring(0,1) === "."){continue;}
			const prefix = "../front_end/themes/" + name + "/";
			ret += await getFromPath(ext, prefix, inline);
		}
		return ret;
	}
	catch (e) { return ""; }
};

export const getAssetDirectories = async  () => {
	const ret = [];

	try {
		const names = await fsp.readdir("../front_end/themes/");
		for (const name of names) {
			if(name.substring(0,1) === "."){continue;}
			const prefix = "../front_end/themes/" + name + "/";
			ret.push(prefix);
		}
		return ret;
	}
	catch (e) { /* Skip if no themes available */ }

	try {
		const names = await fsp.readdir("../front_end/content_types/");
		for (const name of names) {
			if(name.substring(0,1) === "."){continue;}
			const prefix = "../front_end/content_types/" + name + "/";
			ret.push(prefix);
		}
		return ret;
	}
	catch (e) { /* Skip if no themes available */ }

	return ret;
};

export const get = async (extension, inline = false) => {
	const theme = await getFromThemes(extension, inline);
	const contentType = await getFromContentTypes(extension, inline);
	return theme + contentType;
};

export const getJS = async () => {
	return get("js", false);
};

export const getInlineJS = async () => {
	return get("js", true);
};

export const getCSS = async () => {
	return processCSS(await get("css", false));
};

export const getInlineCSS = () => {
	return get("css", true);
};

export const processCSS = async  (css) => {
	const result = postCSS([ autoprefixer ]).process(css);
	result.warnings().forEach(warning => {
		console.warn(warning.toString());
	});
	return result.css;
};
