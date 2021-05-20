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
				__typename
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
		const timedVideoURL = parameters
			? `${videoURL}?${parameters}`
			: videoURL;
		const imageMissingError = imageURL
			? ""
			: EditorialError.render({
				message: "The poster image for this video embedding is missing a URL."
			});
		return `
			${imageMissingError}
			<section content-type="embedding" ${contentTypeIDIf(id)} embedding-type="video">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="embedding">
						<a href="${timedVideoURL}" class="embedding-link">
							<img alt="${title}" height="${imageHeight}" src="${imageURL}" width="${imageWidth}">
						</a>
						${licenseHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
