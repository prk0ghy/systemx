export default {
	queries: new Map([
		["inhaltsbausteine_audioDatei_BlockType", cms => `
			__typename
			audioFiles: audio {
				${cms.fragments.asset}
			}
			caption: audiotext
			isNumbered: nummerierung
			posters: audiobild {
				${cms.fragments.asset}
			}
		`]
	]),
	async render({
		audioFiles,
		caption,
		isNumbered,
		posters
	}, {
		helpers: {
			Image,
			License,
			Marker
		}
	}) {
		const src = audioFiles[0]?.url;
		const poster = posters.length
			? Image.render({
				asset: posters[0]
			})
			: "";
		const license = License.render({
			asset: audioFiles[0]
		});
		return `
			<section content-type="audio">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="audio">
						${poster}
						<audio controls src="${src}"></audio>
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
