export default {
	queries: new Map([
		["inhaltsbausteine_videoDatei_BlockType", cms => `
			__typename
			caption: videoUnterschrift
			files: datei {
				${cms.fragments.asset}
			}
			isNumbered: nummerierung
			posters: posterbild {
				${cms.fragments.asset}
			}
		`]
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
		const license = License.render({
			asset: files[0]
		});
		return `
			<section content-type="video">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="video">
						<video controls poster="${posterURL}" src="${src}"></video>
						${caption
							? `<figcaption>${caption}</figcaption>`
							: ""
						}
					</figure>
					${license}
				</inner-content>
			</section>
		`;
	}
};