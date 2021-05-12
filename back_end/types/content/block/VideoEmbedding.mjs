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
		["elemente_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: embedUnterschrift
				end: ende
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
		["elemente_nested_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: videoUnterschrift
				end: ende
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
		["inhalt_embeddedVideoAudio_BlockType", {
			fetch: () => `
				caption: videoUnterschrift
				end: ende
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
		return `
			<section content-type="embedding" embedding-type="video">
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