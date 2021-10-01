import fs from "fs";
import path from "path";
const fsp = fs.promises;

const templateCache = new Map();
const templatePaths = {};

export const loadDir = async directory => {
	try {
		const fileList = await fs.promises.readdir(directory, {
			withFileTypes: true
		});
		await Promise.all(fileList.map(async directoryEntry => {
			const { name: fileName } = directoryEntry;
			if (directoryEntry.isDirectory()) {
				const subdirectory = path.join(directory, directoryEntry.name);
				return await loadDir(subdirectory);
			}
			const templateName = path.basename(fileName);
			if(templatePaths[templateName]){
				console.log("Not using "+fileName+" since we already have "+templatePaths[templateName]);
				return null;
			}
			templatePaths[templateName] = path.join(directory,fileName);
			return fileName;
		}));
	} catch (error) {
		/* If we can't read the directory we just skip it */
	}
};

export const buildRegions = async templateName => {
	if(!templatePaths[templateName]){return null;}
	const path = templatePaths[templateName];
	const template = await (await fsp.readFile(path)).toString();
	const regions = [{evalText:false, start:0, end: 0}];
	let bracesDeep = 0;
	let lc = null;
	for(let i=0;i<template.length;i++){
		const c = template.charAt(i);
		if((c === '{') && (lc !== "\\")){
			if(++bracesDeep === 1){
				regions[regions.length-1].end = i;
				regions.push({evalText:true, start: i+1, end: i+1});
			}
		}
		if((c === '}') && (lc !== "\\")){
			if(--bracesDeep === 0){
				regions[regions.length-1].end = i;
				regions.push({evalText:false, start: i+1, end: i+1});
			}else if(bracesDeep < 0){
				console.log("Something went wrong when trying to build "+templateName+", we got negative brace depth, not something that should occur.");
			}
		}
		lc = c;
	}
	regions[regions.length-1].end = template.length-1
	return regions.map(({evalText, start, end}) => { return {evalText, text: template.substr(start,end-start)}});
};

const buildTemplate = async templateName => {
	if(templateCache.has(templateName)){return templateCache.get(templateName);}
	const regions = await buildRegions(templateName);
	console.log(regions);
	const λ = async v => regions.map(region => region.evalText ? eval(region.text) : region.text).join("");
	templateCache.set(templateName,λ);
	return λ;
};

export const render = async (templateName, v={}) => {
	if(!templatePaths[templateName]){return templateName + " did not have template bound to it";}
	const template = await buildTemplate(templateName);
	return await template(v);
};
export default render;

await loadDir("/etc/systemx.d/templates/");
await loadDir("~/systemx.d/templates/");