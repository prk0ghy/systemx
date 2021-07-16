export default {
	toSeconds(timestamp) {
		if (!timestamp) {
			return null;
		}
		const date = new Date(timestamp);
		/* Hilariously, editors specify the minutes in the "hour" field */
		const min = date?.getHours();
		/* By this moon logic, seconds must go in the "minute" field */
		const s = date?.getMinutes();
		return 60 * min + s;
	},
	getParameters(startSeconds, endSeconds) {
		const parameters = new URLSearchParams();
		if (startSeconds) {
			parameters.set("start", startSeconds);
		}
		if (endSeconds) {
			parameters.set("end", endSeconds);
		}
		return parameters.toString();
	},
	getPreviewImageURL(videoURL) {
		if (["youtube.", "youtu.be"].some(term => videoURL.includes(term))) {
			return this.getYouTubePreviewImageURL(videoURL);
		}
		return null;
	},
	getYouTubePreviewImageURL(videoURL) {
		const url = new URL(videoURL);
		const videoID = url.hostname.includes("youtu.be")
			/* Short URL */
			? url.pathname.slice(1)
			/* Long URL */
			: url.pathname === "/watch"
				/* The video ID is in the `v` parameter */
				? url.searchParams.get("v")
				: null;
		if (!videoID) {
			console.warn(`Could not extract YouTube video ID from URL: ${videoURL}`);
			return null;
		}
		return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
	},
	queries: new Map([
		["aufgabeElemente_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: embedUnterschrift
				end: ende
				id
				start
				videoData: urlDesStreams {
					imageHeight
					imageURL: image
					imageWidth
					title
					videoURL: url
				}
			`
		}],
		["quersliderInhalt_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: videoUnterschrift
				end: ende
				id
				start
				videoData: urlDesStreams {
					imageHeight
					imageURL: image
					imageWidth
					title
					videoURL: url
				}
			`
		}],
		["aufklappAufgabenElemente_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: videoUnterschrift
				end: ende
				id
				start
				videoData: urlDesStreams {
					imageHeight
					imageURL: image
					imageWidth
					title
					videoURL: url
				}
			`
		}],
		["aufklappElemente_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: embedUnterschrift
				end: ende
				id
				start
				videoData: urlDesStreams {
					imageHeight
					imageURL: image
					imageWidth
					title
					videoURL: url
				}
			`
		}],
		["inhaltsbausteine_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: videoUnterschrift
				end: ende
				id
				isNumbered: nummerierung
				start
				videoData: urlDesVideos {
					imageHeight
					imageURL: image
					imageWidth
					title
					videoURL: url
				}
			`
		}]
	]),
	async render({
		caption,
		end,
		id,
		isNumbered,
		start,
		videoData: {
			imageHeight,
			imageURL,
			imageWidth,
			title,
			videoURL
		}
	}, {
		contentTypeIDIf,
		download,
		EditorialError,
		helpers: {
			License,
			Marker
		}
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		const licenseHTML = License.render({
			asset: {
				source: videoURL
			}
		});
		const startSeconds = this.toSeconds(start);
		const endSeconds = this.toSeconds(end);
		const parameters = this.getParameters(startSeconds, endSeconds).toString();
		const separator = videoURL.includes("?")
			? "&"
			: "?";
		const thirdPartyImageURL = imageURL || this.getPreviewImageURL(videoURL);
		let downloadError = "";
		let firstPartyImageURL = "";
		try {
			firstPartyImageURL = thirdPartyImageURL && await download(thirdPartyImageURL);
		} catch(e) {
			console.warn(e);
			downloadError = e;
			/* Better to print an error than to stop everything, maybe generate an image with an error message? */
		}
		console.log(videoURL);
		console.log(separator);
		const timedVideoURL = parameters
			? `${videoURL}${separator}${parameters}`
			: videoURL;
		const imageMissingError = firstPartyImageURL
			? ""
			: EditorialError.render({
				message: downloadError ? `There was an error while downloading the posterframe: ${downloadError}` : "The preview image for this video embedding is missing a URL."
			});
		return `
			${imageMissingError}
			<section content-type="embedding" ${contentTypeIDIf(id)} embedding-type="video">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="embedding">
						<a href="${timedVideoURL}" class="embedding-link">
							<img alt="${title}" height="${imageHeight}" src="${firstPartyImageURL}" width="${imageWidth}">
						</a>
						${licenseHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
