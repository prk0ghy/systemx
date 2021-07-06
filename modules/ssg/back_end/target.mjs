import * as resources from "./page_elements/resources.mjs";
import { loadContentTypes, loadHelperTypes } from "./types.mjs";
import { buildHead } from "./page_elements/head.mjs";
import { formatHTML } from "./format.mjs";
import fs from "fs";
import { loadNavigation } from "./page_elements/navigation.mjs";
import Marker from "./types/helper/Marker.mjs";
import { mkdirp } from "../../common/fileSystem.mjs";
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
const getTargetPath    = targetName => options.cleanBuild ? getTargetPathNew(targetName) : getTargetPathRaw(targetName);
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
	const contentTypes = await loadContentTypes();
	const helperTypes = await loadHelperTypes();
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
	const entries = await getEntries();
	const targetPath = getTargetPath(targetName);
	const mediaPath = getMediaPath(targetName);
	await mkdirp(mediaPath);
	let warningHTML = "";
	const cmsContext = await getCMSContext(introspectCraft);
	const contentTypes = await loadContentTypes();
	const helperTypes = await loadHelperTypes();
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
		const globalRender = makeRenderer(contentTypes);
		const html = await globalRender(entry, new RenderingContext({
			cms: cmsContext,
			globalRender,
			hints: {
				appendError: (() => {
					let lastURI = null;
					return (html, context) => {
						if (context.type !== "root") {
							if (lastURI !== entry.uri) {
								warningHTML += `
									<h1><a href="/${entry.uri}">${entry.uri}</a></h1>
								`;
							}
							lastURI = entry.uri;
							warningHTML += html;
						}
					};
				})(),
				/*
				* Determines an absolute, target-specific path to wherever the media file `fileName` should be saved at.
				*
				* `callback` is executed once we know whether or not a download is necessary. The second argument denotes whether a download is necessary.
				* The caller can use this to download the file to the path specified in the first argument of `callback`.
				*
				* This function returns a path to the media resource that can be put in HTML.
				*/
				handleMedia: async (fileName, modificationDate, callback) => {
					const filePath = path.join(mediaPath, fileName);
					try {
						const { mtime } = await fsp.stat(filePath);
						const needsDownload = modificationDate > mtime;
						await callback(filePath, needsDownload);
					}
					catch {
						/* Doesn't matter if it fails, we just save a new medium */
						await callback(filePath, true);
					}
					const htmlPath = filePath.replace(targetPath, "");
					return htmlPath;
				}
			},
			types: {
				content: contentTypes,
				helper: helperTypes
			}
		}));
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
	if (options.forceRendering) {
		const warningPath = path.join(targetPath, "warnings.html");
		await fsp.writeFile(warningPath, await wrapWithApplicationShell(targetName, {
			content: warningHTML || "<h1>No warnings<h1>",
			pageTitle: "Render warnings"
		}));
	}
};
/*
* When updating first we rename DIR to DIR.old, then when this succeeds we rename DIR.new to DIR
* and finally remove the DIR.old and DIR.new dirs if they are still around.
* The main renaming is also done in a blocking manner to make sure that they get the highest priority.
*/
const atomicRename = async targetName => {
	try {
		await fsp.rm(getTargetPathOld(targetName),{recursive: true});
	} catch {
		/* Shouldn't happen but maybe an old folder is still hanging around due to a past error */
	}
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
	try {
		await fsp.rm(getTargetPathOld(targetName),{recursive: true});
	} catch {
		/* Strange but not a problem if the .old folder doesn't exist */
	}
	try {
		await fsp.rm(getTargetPathNew(targetName),{recursive: true});
	} catch {
		/* Should only happen in case of an error */
	}
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
	await buildHead(targetName);
	await renderAssets(resourcePath);
	if (!options.skipNetwork) {
		console.time("target#buildEntries");
		await loadNavigation(targetName);
		await buildEntries(targetName);
		console.timeEnd("target#buildEntries");
	}
	if(options.cleanBuild){
		await atomicRename(targetName);
	}
};