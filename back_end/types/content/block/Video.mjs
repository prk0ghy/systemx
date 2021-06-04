export default {
	queries: new Map([
		["aufgabeElemente_videoDatei_BlockType", {
			fetch: cms => `
				caption: videounterschrift
				files: datei {
					${cms.fragments.asset}
				}
				id
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}],
		["aufklappAufgabenElemente_videoDatei_BlockType", {
			fetch: cms => `
				caption: videounterschrift
				files: datei {
					${cms.fragments.asset}
				}
				id
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}],
		["aufklappElemente_videoDatei_BlockType", {
			fetch: cms => `
				caption: videounterschrift
				files: datei {
					${cms.fragments.asset}
				}
				id
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}],
		["inhaltsbausteine_videoDatei_BlockType", {
			fetch: cms => `
				caption: videoUnterschrift
				files: datei {
					${cms.fragments.asset}
				}
				id
				isNumbered: nummerierung
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}],
		["quersliderAufgabenElemente_videoDatei_BlockType", {
			fetch: cms => `
				caption: videounterschrift
				files: datei {
					${cms.fragments.asset}
				}
				id
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}],
		["quersliderInhalt_videoDatei_BlockType", {
			fetch: cms => `
				caption: videoUnterschrift
				files: datei {
					${cms.fragments.asset}
				}
				id
				posters: posterbild {
					${cms.fragments.asset}
				}
			`
		}]
	]),
	async render({
		caption,
		files,
		id,
		isNumbered,
		posters
	}, {
		contentTypeIDIf,
		download,
		EditorialError,
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
		if (!src) {
			return EditorialError.render({
				message: "This element is missing a file."
			});
		}
		return `
			<section content-type="video" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="video">
						<video controls poster="${posterURL}" src="${await download(src)}"></video>
						${captionHTML}
					</figure>
					${licenseHTML}
					<help-icon></help-icon>
				</inner-content>
			</section>
		`;
	}
};
