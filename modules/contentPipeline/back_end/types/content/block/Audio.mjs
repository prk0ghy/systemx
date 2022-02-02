export default {
	queries: new Map([
		["aufgabeElemente_audioDatei_BlockType", {
			fetch: ({fragments}) => `
				audioFiles: audiodatei {
					${fragments.asset}
				}
				caption: audiounterschrift
				id
			`
		}],
		["aufklappElemente_audioDatei_BlockType", {
			fetch: ({fragments}) => `
				audioFiles: audiodatei {
					${fragments.asset}
				}
				caption: audiounterschrift
				id
			`
		}],
		["quersliderInhalt_audioDatei_BlockType", {
			fetch: ({fragments}) => `
				audioFiles: audio {
					${fragments.asset}
				}
				caption: audiounterschrift
				id
			`
		}],
		["inhaltsbausteine_audioDatei_BlockType", {
			fetch: ({fragments}) => `
				audioFiles: audio {
					${fragments.asset}
				}
				caption: audiotext
				id
				isNumbered: nummerierung
				starSelection: stern_selection
				posters: audiobild {
					${fragments.asset}
				}
			`,map: ({
				isNumbered,
				starSelection,
				...rest
			}) => ({
				starSelection,
				isNumbered: (isNumbered && !starSelection),
				...rest
			})
		}]
	]),
	async render({
		audioFiles,
		caption,
		id,
		isNumbered,
		starSelection,
		posters
	}, {
		attributeIf,
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
			<section content-type="audio" ${contentTypeIDIf(id)} ${attributeIf('star-selection', starSelection)}>
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
