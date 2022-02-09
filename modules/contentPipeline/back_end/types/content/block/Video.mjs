export default {
	queries: new Map([
		["aufgabeElemente_videoDatei_BlockType", {
			fetch: ({fragments}) => `
				caption: videounterschrift
				files: datei {
					${fragments.asset}
				}
				id
				posters: posterbild {
					${fragments.asset}
				}
			`
		}],
		["aufklappAufgabenElemente_videoDatei_BlockType", {
			fetch: ({fragments}) => `
				caption: videounterschrift
				files: datei {
					${fragments.asset}
				}
				id
				posters: posterbild {
					${fragments.asset}
				}
			`
		}],
		["aufklappElemente_videoDatei_BlockType", {
			fetch: ({fragments}) => `
				caption: videounterschrift
				files: datei {
					${fragments.asset}
				}
				id
				posters: posterbild {
					${fragments.asset}
				}
			`
		}],
		["inhaltsbausteine_videoDatei_BlockType", {
			fetch: ({fragments}) => `
				caption: videoUnterschrift
				files: datei {
					${fragments.asset}
				}
				id
				isNumbered: nummerierung
				starSelection: stern_selection
				posters: posterbild {
					${fragments.asset}
				}
			`,
			map: ({
				isNumbered,
				starSelection,
				...rest
			}) => ({
				starSelection,
				isNumbered: (isNumbered && (starSelection === "standard")),
				...rest
			})
		}],
		["quersliderAufgabenElemente_videoDatei_BlockType", {
			fetch: ({fragments}) => `
				caption: videounterschrift
				files: datei {
					${fragments.asset}
				}
				id
				posters: posterbild {
					${fragments.asset}
				}
			`
		}],
		["quersliderInhalt_videoDatei_BlockType", {
			fetch: ({fragments}) => `
				caption: videoUnterschrift
				files: datei {
					${fragments.asset}
				}
				id
				posters: posterbild {
					${fragments.asset}
				}
			`
		}]
	]),
	async render({
		caption,
		files,
		id,
		isNumbered,
		posters,
		starSelection
	}, {
		attributeIf,
		contentTypeIDIf,
		EditorialError,
		helpers: {
			License,
			Marker,
			Video
		}
	}) {
		const src = files[0]?.url;
		const posterURL = posters[0]?.url || null;
		const licenseHTML = License.render({
			asset: files[0]
		});
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "<figcaption></figcaption>";
		if (!src) {
			return EditorialError.render({
				message: "This element is missing a file."
			});
		}
		const videoHTML = await Video.render({
			asset: files[0],
			posterURL
		});
		return `
			<section content-type="video" ${contentTypeIDIf(id)} ${attributeIf('star-selection', starSelection)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="video">
						${videoHTML}
						${captionHTML}
					</figure>
					${licenseHTML}
				</inner-content>
			</section>
		`;
	}
};
