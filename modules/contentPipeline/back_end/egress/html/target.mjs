import * as resources from "./page_elements/resources.mjs";
import { buildHead } from "./page_elements/head.mjs";
import { formatHTML } from "systemx-common/format.mjs";
import crypto from "crypto";
import fs from "fs";
import Marker from "../../types/helper/Marker.mjs";
import { mkdirp } from "systemx-common/fileSystem.mjs";
import loadModules from "systemx-common/loadModules.mjs";
import path from "path";
import query, { getContext as getCMSContext, introspectCraft } from "../../ingress/graphql/cms.mjs";
import { makeRenderer } from "../../renderer.mjs";
import RenderingContext from "../../renderingContext.mjs";
import wrapWithApplicationShell from "./page.mjs";
import supportMessage from "systemx-common/supportMessenger.mjs";
import config from "../../config.mjs";
export const resourceDirectoryName = "resources";
const fsp = fs.promises;
/*
 * Should actually execute a GraphQL query to figure out what contents need to be displayed,
 * but since there is only a single target right now, we're hardcoding the home page.
 */
const getHomePageURI = entries => {
	const lastGuess = entries.find(entry => entry.__typename === "inhalt_inhalt_Entry");
	if(!lastGuess || !lastGuess.uri){
		throw new Error("Could not determine home page");
	}else{
		return lastGuess.uri;
	}
};
/*
 * Every project is a "target".
 * Every target will be output into its own directory.
 *
 * This function determines the path to that directory.
 */
const getTargetPathNew = targetName => path.join(config.distributionPath, `${targetName}.new`);
const getTargetPathOld = targetName => path.join(config.distributionPath, `${targetName}.old`);
const getTargetPathRaw = targetName => path.join(config.distributionPath, targetName);
export const getTargetPath = targetName => config.cleanBuild ? getTargetPathNew(targetName) : getTargetPathRaw(targetName);
/*
 * Targets can make use of resources in HTML.
 * Resources can be of any file type; they don't have to be images.
 *
 * This function determines the path to a resource directory within a target.
 */
export const getResourcePath = targetName => path.join(getTargetPath(targetName), resourceDirectoryName);
/*
 * Media are one kind of resource, specifically images or videos.
 *
 * This function determines the path to a media directory within a target.
 */
const getMediaPath = targetName => path.join(getResourcePath(targetName), "media");
const getThumbPath = targetName => path.join(getResourcePath(targetName), "thumb");
/*
 * Just a precaution against hash collision that might occur, unlikely but would be good to know if it dies occur
 */
const checkHashCollision = (() => {
	const collisionMap = new Map();
	return (data,hash) => {
		if(!collisionMap.has(hash)){
			collisionMap.set(hash,data);
		}else{
			if(collisionMap.get(hash) !== data){
				const msg = `DETECTED HASH COLLISION!!! - ${hash} == ${data} == ${collisionMap.get(hash)}`;
				console.error(msg);
				throw new Error(msg);
			}
		}
	};
})();
/*
 * Recursively renders all the files in `source` into `directory`.
 * If the file does not end with ".html", it will be copied over without any processing.
 *
 * If `destination` doesn't exist, it will be created.
 */
const renderDirectory = async (source, destination, targetName) => {
	await mkdirp(destination);
	const fileNames = await fsp.readdir(source);
	const promises = [];
	for (const fileName of fileNames) {
		try {
			const sourcePath = path.join(source, fileName);
			const targetPath = path.join(destination, fileName);
			const stat = await fsp.stat(sourcePath);
			if (stat.isFile()) {
				promises.push(fsp.copyFile(sourcePath, targetPath));
			}
			else if (stat.isDirectory()) {
				/* Ignore everything else */
				promises.push(renderDirectory(sourcePath, targetPath, targetName));
			}
		}
		catch {
			/* If we can't stat, then just skip */
		}
	}
	return Promise.all(promises);
};
/*
 * This function renders all asset directories to `destination`.
 *
 * Asset directories are front-end directories that include CSS, JS and fonts.
 * If they include `.html` files, they, too, will be rendered.
 */
const renderAssets = async destination => {
	const assetDirectories = await resources.getAssetDirectories();
	return Promise.all(assetDirectories.map(directory => renderDirectory(directory, destination)));
};

const getEntries = async status_fields => {
	const { entries } = await query(() => `
		entries(siteId: "*", status:${status_fields}) {
			__typename
			dateUpdated
			id
			title
			language
			level
			status
			parent {
				id
			}
			uid
			uri
			url
		}
	`);
	return entries;
};

export const convertCraftURLToURI = url => `${url}`.replace(/\/?index\.html$/,"").replace(/https?:\/\/[^/]+\//,"").replace(/^\//,"");

const findEntryByURI = (entries, uri) => {
	const url = convertCraftURLToURI(uri);
	return entries.find(entry => convertCraftURLToURI(entry.url) === url);
};
const getEntryByID = (entries, id) => {
	return entries.find(entry => entry.id === id);
};
const getStatus = (entries, entry) => {
	if(!entry){console.error(new Error("Can't determine status!"));}
	if(entry.status !== "live"){
		return entry.status;
	}
	if(!entry.parent){
		if(entry.level === 1){
			return entry.status;
		}else{
			return "disabled";
		}
	}
	return getStatus(entries, getEntryByID(entries, entry.parent.id));
};
/*
 * This functions renders a single entry and returns the complete HTML for it, including all warnings at the top.
 *
 * Should only be used as a preview for authors; production releases should use `buildEntries` instead.
 */
export const renderSingleEntry = async (targetName, uri) => {
	const entries = await getEntries('["disabled","live"]');
	let entry = findEntryByURI(entries, uri);
	if((uri === "") || (uri === "/") || (uri === "/index.html")){
		const homePageURI = getHomePageURI(entries);
		entry = entries.find(entry => entry.uri === homePageURI);
	}
	if (!entry) {
		console.error(`404: ${uri}`);
		return {
			html: await wrapWithApplicationShell(targetName, {
				content: `
					<main>
						<center>
							<h1>404 - Page not found</h1>
						</center>
					</main>
				`,
				pageTitle: "404 - Page not found",
				pageURI: uri
			}),
			status: 404
		};
	}
	const effectiveURI = convertCraftURLToURI(entry.url);
	const cmsContext   = await getCMSContext(introspectCraft);
	const contentTypes = await loadModules("./types/content");
	const helperTypes  = await loadModules("./types/helper");
	const globalRender = makeRenderer(contentTypes);
	const content      = await globalRender(entry, new RenderingContext({
		cms: cmsContext,
		globalRender,
		types: {
			content: contentTypes,
			helper: helperTypes
		}
	}));

	const wrappedHTML = await wrapWithApplicationShell(targetName, {
		content,
		entry,
		language : entry.language,
		status: getStatus(entries,entry),
		pageTitle: entry.title,
		pageURI: `${effectiveURI}/index.html`
	});
	return {
		html: Marker.fill(wrappedHTML),
		status: 200
	};
};
const sendWarning = async (targetName,warning) => {
	const link = "\n<" + warning.backendLink + "|Edit Entry>";
	await supportMessage({
		text: warning.message + link
	});
};
const sendWarnings = async (targetName,warnings) => {
	if (!warnings[0]) {return;}
	sendWarning(targetName,warnings[0]);
};
/*
 * This function fetches and then renders all "entries", which is CraftCMS-speak for pages.
 * Essentially, this is the heart of systemx.
 */
export const buildEntries = async targetName => {
	let warningHTML     = "";
	const warnings      = [];
	const entries       = await getEntries(`"live"`);
	const targetPath    = getTargetPath(targetName);
	const mediaPath     = getMediaPath(targetName);
	const thumbPath     = getThumbPath(targetName);
	await mkdirp(mediaPath);
	await mkdirp(thumbPath);
	const cmsContext    = await getCMSContext(introspectCraft);
	const contentTypes  = await loadModules("./types/content");
	const helperTypes   = await loadModules("./types/helper");
	const globalRender  = makeRenderer(contentTypes);
	const globalContext = new RenderingContext({
		cms: cmsContext,
		globalRender,
		hints: {
			appendError: (data, context) => {
				if (context.type !== "root") {
					warningHTML += data.html;
					warnings.push(data);
				}
			},
			shouldMakeThumbnail: path => {
				switch(path.substring(path.lastIndexOf('.')+1).toLowerCase()){
				case "jpg":
				case "jpeg":
				case "png":
				case "webp":
					return true;
				default:
					return false;
				}
			},
			getFilePath: url => {
				const urlObject = new URL(url.startsWith("//") ? `https:${url}` : url);
				const hash = crypto.createHash("sha1");
				hash.update(url,'utf-8');
				const hashPrefix = hash.digest('hex');
				checkHashCollision(url,hashPrefix);
				const fileName = `${hashPrefix}_${decodeURIComponent(urlObject
					.pathname
					.substring(urlObject.pathname.lastIndexOf("/") + 1)
				)}`;
				const filePath = path.join(mediaPath, fileName);
				const htmlPath = filePath.substring(targetPath.length);
				const thumb = {
					"filePath": path.join(thumbPath, fileName)
				};
				thumb.htmlPath = (thumbPath + thumb.filePath.substring(mediaPath.length)).substring(targetPath.length);

				return {filePath, htmlPath, thumb};
			}
		},
		types: {
			content: contentTypes,
			helper: helperTypes
		}
	});
	await Promise.all(entries.map(async entry => {
		const directory = await mkdirp(targetPath, convertCraftURLToURI(entry.url));
		const outputFilePath = path.join(directory, "index.html");
		try {
			const { mtime } = await fsp.stat(outputFilePath);
			if (!config.forceRendering && Date.parse(mtime) > Date.parse(entry.dateUpdated)) {
				return;
			}
		}
		catch {
			/* Doesn't matter if it fails, we just render a new file */
		}
		const content = await globalRender(entry, globalContext);
		/* Remove target prefix and in case of Windows, replace blackslashes with forward slashes */
		const uri = outputFilePath.substring(targetPath.length).replace(/\\/g, "/");
		const wrappedHTML = await wrapWithApplicationShell(targetName, {
			content,
			entry,
			pageTitle: entry.title,
			pageURI: uri
		});
		const finalHTML = Marker.fill(wrappedHTML);
		await fsp.writeFile(outputFilePath, formatHTML(finalHTML));
	}));
	await sendWarnings(targetName, warnings);
	const homePageSourcePath = path.join(targetPath, await getHomePageURI(entries), "index.html");
	const homePageDestinationPath = path.join(targetPath, "index.html");
	try {
		const { smtime } = await fsp.stat(homePageSourcePath);
		try {
			const { dmtime } = await fsp.stat(homePageDestinationPath);
			if (config.forceRendering || Date.parse(smtime) > Date.parse(dmtime)) {
				await fsp.copyFile(homePageSourcePath, homePageDestinationPath);
			}
		}
		catch {
			await fsp.copyFile(homePageSourcePath, homePageDestinationPath);
		}
	}
	catch {
		/* Nothing we can do if it fails */
	}
	if (config.cleanBuild || config.forceRendering) {
		const warningPath = path.join(targetPath, "warnings.html");
		await fsp.writeFile(warningPath, await wrapWithApplicationShell(targetName, {
			content: warningHTML || "<h2>No warnings</h2>",
			pageTitle: "Render warnings"
		}));
	}
	if (config.disallowRobots) {
		const robotsPath = path.join(targetPath, "robots.txt");
		await fsp.writeFile(robotsPath, "User-agent: *\nDisallow: /\n");
	}
};
/*
 * When updating first we rename DIR to DIR.old, then when this succeeds we rename DIR.new to DIR
 * and finally remove the DIR.old and DIR.new dirs if they are still around.
 * The main renaming is also done in a blocking manner to make sure that they get the highest priority.
 */
const atomicRename = async targetName => {
	console.time("atomic#rmOld");
	try {
		await fsp.rm(getTargetPathOld(targetName),{recursive: true});
	} catch {
		/* Shouldn't happen but maybe an old folder is still hanging around due to a past error */
	}
	console.timeEnd("atomic#rmOld");
	console.time("atomic#mv");
	try {
		fs.renameSync(getTargetPathRaw(targetName),getTargetPathOld(targetName));
		try {
			fs.renameSync(getTargetPathNew(targetName),getTargetPathRaw(targetName));
		} catch {
			console.error("Error when marking the new version as the current one, rolling back");
			fs.renameSync(getTargetPathOld(targetName),getTargetPathRaw(targetName));
		}
	} catch {
		// First we check if there actually is a current version, if not we can just continue
		if(!fs.existsSync(getTargetPathRaw(targetName))){
			try {
				fs.renameSync(getTargetPathNew(targetName),getTargetPathRaw(targetName));
			} catch {
				console.error("Error when marking the new version as the current one, rolling back");
				fs.renameSync(getTargetPathOld(targetName),getTargetPathRaw(targetName));
			}
		}else{
			console.error("Error when marking the current version as old, rolling back");
			await fs.renameSync(getTargetPathOld(targetName),getTargetPathRaw(targetName));
		}
	}
	console.timeEnd("atomic#mv");
	try {
		await fsp.rm(getTargetPathOld(targetName),{recursive: true});
	} catch {
		/* Strange but not a problem if the .old folder doesn't exist */
	}
	console.time("atomic#rmNew");
	try {
		await fsp.rm(getTargetPathNew(targetName),{recursive: true});
	} catch {
		/* Should only happen in case of an error */
	}
	console.timeEnd("atomic#rmNew");
};
/*
 * Builds a target, given its name.
 */
export const build = async targetName => {
	if(config.cleanBuild){
		try {
			await fsp.rm(getTargetPathNew(targetName),{recursive: true});
		} catch {
			/* Most likely means the target folder doesn't exist in the first place */
		}
	}
	const resourcePath = getResourcePath(targetName);
	mkdirp(resourcePath);

	console.time("target#buildHead");
	await buildHead(targetName);
	console.timeEnd("target#buildHead");

	console.time("target#renderAssets");
	await renderAssets(resourcePath);
	console.timeEnd("target#renderAssets");

	if (!config.skipNetwork) {
		console.time("target#buildEntries");
		await buildEntries(targetName);
		console.timeEnd("target#buildEntries");
	}
	if(config.cleanBuild){
		console.log("atomicRename");
		await atomicRename(targetName);
	}
};
