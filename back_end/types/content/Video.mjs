export default {
	queries: new Map([
		["elemente_videoDatei_BlockType", {
			fetch: cms => `
				__typename
				caption: videounterschrift
				files: datei {
					${cms.fragments.asset}
				}
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}],
		["inhaltsbausteine_videoDatei_BlockType", {
			fetch: cms => `
				__typename
				caption: videoUnterschrift
				files: datei {
					${cms.fragments.asset}
				}
				isNumbered: nummerierung
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}]
	]),
	async render({
		caption,
		files,
		isNumbered,
		posters
	}, {
		helpers: {
			License,
			Marker
		}
	}) {
		const src = files[0]?.url;
		const posterURL = posters[0]?.url || "";
		const licenseHTML = License.render({
			asset: files[0]
		});
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="video">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="video">
						<video controls poster="${posterURL}" src="${src}"></video>
						${captionHTML}
					</figure>
					${licenseHTML}
				</inner-content>
			</section>
		`;
	}
};
