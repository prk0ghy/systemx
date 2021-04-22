export default {
	queries: new Map([
		["inhaltsbausteine_embeddedVideoAudio_BlockType", {
			fetch: () => `
				__typename
				caption: videoUnterschrift
				isNumbered: nummerierung
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
		isNumbered,
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
		return `
			<section content-type="embedding" embedding-type="video">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="embedding">
						<a href="${videoURL}" class="embedding-link">
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
