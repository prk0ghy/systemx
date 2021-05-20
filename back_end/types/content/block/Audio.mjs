export default {
	queries: new Map([
		["aufgabeElemente_audioDatei_BlockType", {
			fetch: cms => `
				audioFiles: audiodatei {
					${cms.fragments.asset}
				}
				caption: audiounterschrift
				id
			`
		}],
		["aufklappElemente_audioDatei_BlockType", {
			fetch: cms => `
				audioFiles: audiodatei {
					${cms.fragments.asset}
				}
				caption: audiounterschrift
				id
			`
		}],
		["quersliderInhalt_audioDatei_BlockType", {
			fetch: cms => `
				audioFiles: audio {
					${cms.fragments.asset}
				}
				caption: audiounterschrift
				id
			`
		}],
		["inhaltsbausteine_audioDatei_BlockType", {
			fetch: cms => `
				__typename
				audioFiles: audio {
					${cms.fragments.asset}
				}
				caption: audiotext
				id
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
		id,
		isNumbered,
		posters
	}, {
		contentTypeIDIf,
		download,
		EditorialError,
		helpers: {
			Image,
			License,
			Marker
		}
	}) {
		const resource = audioFiles?.[0];
		if (!resource) {
			return EditorialError.render({
				message: "This element is missing a resource."
			});
		}
		const src = resource?.url;
		const poster = posters?.length
			? await Image.render({
				asset: posters[0]
			})
			: "";
		const license = License.render({
			asset: resource
		});
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		if (!src) {
			return EditorialError.render({
				message: "This element is missing a source."
			});
		}
		return `
			<section content-type="audio" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="audio">
						${poster}
						<audio controls src="${await download(src)}"></audio>
						${captionHTML}
					</figure>
					${license}
				</inner-content>
			</section>
		`;
	}
};
