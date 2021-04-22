export default {
	queries: new Map([
		["elemente_audioDatei_BlockType", {
			fetch: cms => `
				__typename
				audioFiles: audiodatei {
					${cms.fragments.asset}
				}
				caption: audiounterschrift
			`
		}],
		["inhalt_audioDatei_BlockType", {
			fetch: cms => `
				__typename
				audioFiles: audio {
					${cms.fragments.asset}
				}
				caption: audiounterschrift
			`
		}],
		["inhaltsbausteine_audioDatei_BlockType", {
			fetch: cms => `
				__typename
				audioFiles: audio {
					${cms.fragments.asset}
				}
				caption: audiotext
				isNumbered: nummerierung
				posters: audiobild {
					${cms.fragments.asset}
				}
			`
		}]
	]),
	async render({
		audioFiles,
		caption,
		isNumbered,
		posters
	}, {
		EditorialError,
		helpers: {
			Image,
			License,
			Marker
		}
	}) {
		const src = audioFiles[0]?.url;
		const poster = posters?.length
			? Image.render({
				asset: posters[0]
			})
			: "";
		const license = License.render({
			asset: audioFiles[0]
		});
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		if (!src) {
			return EditorialError.render({
				message: "This element is missing a file."
			});
		}
		return `
			<section content-type="audio">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="audio">
						${poster}
						<audio controls src="${src}"></audio>
						${captionHTML}
					</figure>
					${license}
				</inner-content>
			</section>
		`;
	}
};
