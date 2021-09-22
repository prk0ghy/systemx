import * as resources from "./page_elements/resources.mjs";
import { buildHead } from "./page_elements/head.mjs";
import { formatHTML } from "./format.mjs";
import crypto from "crypto";
import fs from "fs";
import { loadNavigation } from "./page_elements/navigation.mjs";
import Marker from "./types/helper/Marker.mjs";
import { mkdirp } from "../../common/fileSystem.mjs";
import loadModules from "../../common/loadModules.mjs";
import options from "../../common/options.mjs";
import path from "path";
import query, { getContext as getCMSContext, introspectCraft } from "./cms.mjs";
import { makeRenderer } from "./renderer.mjs";
import RenderingContext from "./RenderingContext.mjs";
import wrapWithApplicationShell from "./page.mjs";
export const resourceDirectoryName = "resources";
const fsp = fs.promises;
/*
* Should actually execute a GraphQL query to figure out what contents need to be displayed,
* but since there is only a single target right now, we're hardcoding the home page.
*/
const getHomePageURI = entries => {
	const homeEntry = entries.find(entry => entry.references);
	if (!homeEntry || !homeEntry.references.length) {
		throw new Error("Could not determine home page");
	}
	return homeEntry.references[0].uri;
};
/*
* Every project is a "target".
* Every target will be output into its own directory.
*
* This function determines the path to that directory.
*/
const getTargetPathNew = targetName => path.join(options.distributionPath, `${targetName}.new`);
const getTargetPathOld = targetName => path.join(options.distributionPath, `${targetName}.old`);
const getTargetPathRaw = targetName => path.join(options.distributionPath, targetName);
export const getTargetPath = targetName => options.cleanBuild ? getTargetPathNew(targetName) : getTargetPathRaw(targetName);
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
const getEntries = async () => {
	const { entries } = await query(() => `
		entries {
			__typename
			dateUpdated
			id
			title
			uid
			uri
			...on startseite_verweis_Entry {
				references: starteintrag {
					uri
				}
			}
		}
	`);
	return entries;
};
/*
* This functions renders a single entry and returns the complete HTML for it, including all warnings at the top.
*
* Should only be used as a preview for authors; production releases should use `buildEntries` instead.
*/
export const renderSingleEntry = async (targetName, uri) => {
	const loadNavigationPromise = loadNavigation(targetName);
	const entries = await getEntries();
	const homePageURI = getHomePageURI(entries);
	const entry = entries.find(entry => entry.uri === uri) || entries.find(entry => entry.uri === homePageURI);
	const effectiveURI = entry.uri;
	if (!entry) {
		console.error(`404: ${effectiveURI}`);
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
	const cmsContext = await getCMSContext(introspectCraft);
	const contentTypes = await loadModules("modules/ssg/back_end/types/content");
	const helperTypes = await loadModules("modules/ssg/back_end/types/helper");
	const globalRender = makeRenderer(contentTypes);
	const html = await globalRender(entry, new RenderingContext({
		cms: cmsContext,
		globalRender,
		types: {
			content: contentTypes,
			helper: helperTypes
		}
	}));
	await loadNavigationPromise;
	const wrappedHTML = await wrapWithApplicationShell(targetName, {
		content: html,
		pageTitle: entry.title,
		pageURI: `/${effectiveURI}/index.html`
	});
	const finalHTML = Marker.fill(wrappedHTML);
	return {
		html: finalHTML,
		status: 200
	};
};
/*
* This function fetches and then renders all "entries", which is CraftCMS-speak for pages.
* Essentially, this is the heart of systemx.
*/
export const buildEntries = async targetName => {
	let warningHTML    = "";
	const entries      = await getEntries();
	const targetPath   = getTargetPath(targetName);
	const mediaPath    = getMediaPath(targetName);
	const thumbPath    = getThumbPath(targetName);
	await mkdirp(mediaPath);
	await mkdirp(thumbPath);
	const cmsContext   = await getCMSContext(introspectCraft);
	const contentTypes = await loadModules("modules/ssg/back_end/types/content");
	const helperTypes  = await loadModules("modules/ssg/back_end/types/helper");
	const globalRender = makeRenderer(contentTypes);
	const globalContext = new RenderingContext({
		cms: cmsContext,
		globalRender,
		hints: {
			appendError: (html, context) => {
				if (context.type !== "root") {
					warningHTML += html;
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
					.substr(urlObject.pathname.lastIndexOf("/") + 1)
				)}`;
				const filePath = path.join(mediaPath, fileName);
				const htmlPath = filePath.substr(targetPath.length);
				const thumb = {
					"filePath": path.join(thumbPath, fileName)
				};
				thumb.htmlPath = (thumbPath + thumb.filePath.substr(mediaPath.length)).substr(targetPath.length);

				return {filePath, htmlPath, thumb};
			}
		},
		types: {
			content: contentTypes,
			helper: helperTypes
		}
	});
	await Promise.all(entries.map(async entry => {
		const directory = await mkdirp(targetPath, entry.uri);
		const outputFilePath = path.join(directory, "index.html");
		try {
			const { mtime } = await fsp.stat(outputFilePath);
			if (!options.forceRendering && Date.parse(mtime) > Date.parse(entry.dateUpdated)) {
				return;
			}
		}
		catch {
			/* Doesn't matter if it fails, we just render a new file */
		}
		const html = await globalRender(entry, globalContext);
		/* Remove target prefix and in case of Windows, replace blackslashes with forward slashes */
		const uri = outputFilePath.substr(targetPath.length).replace(/\\/g, "/");
		const wrappedHTML = await wrapWithApplicationShell(targetName, {
			content: html,
			pageTitle: entry.title,
			pageURI: uri
		});
		const finalHTML = Marker.fill(wrappedHTML);
		await fsp.writeFile(outputFilePath, formatHTML(finalHTML));
	}));
	const homePageSourcePath = path.join(targetPath, await getHomePageURI(entries), "index.html");
	const homePageDestinationPath = path.join(targetPath, "index.html");
	try {
		const { smtime } = await fsp.stat(homePageSourcePath);
		try {
			const { dmtime } = await fsp.stat(homePageDestinationPath);
			if (options.forceRendering || Date.parse(smtime) > Date.parse(dmtime)) {
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
	if (options.cleanBuild || options.forceRendering) {
		const warningPath = path.join(targetPath, "warnings.html");
		await fsp.writeFile(warningPath, await wrapWithApplicationShell(targetName, {
			content: warningHTML || "<h1>No warnings<h1>",
			pageTitle: "Render warnings"
		}));
	}
	if (options.disallowRobots) {
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
	if(options.cleanBuild){
		try {
			await fsp.rm(getTargetPathNew(targetName),{recursive: true});
		} catch {
			/* MOst likely means the target folder doesn't exist in the first place */
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

	if (!options.skipNetwork) {
		console.time("target#buildEntries");
		await loadNavigation(targetName);
		await buildEntries(targetName);
		console.timeEnd("target#buildEntries");
	}
	if(options.cleanBuild){
		console.log("atomicRename");
		await atomicRename(targetName);
	}
};
