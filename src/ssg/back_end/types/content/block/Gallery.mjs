export default {
	queries: new Map([
		["aufgabeElemente_galerie_BlockType", {
			fetch: cms => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
				id
				galleryIntroductionText: galerietext
			`,
			map: ({
				captions,
				files,
				...rest
			}) => ({
				images: files.map((file, index) => ({
					caption: captions[index]?.text || null,
					files: [file]
				})),
				...rest
			})
		}],
		["aufklappAufgabenElemente_galerie_BlockType", {
			fetch: cms => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
				id
				galleryIntroductionText: galerietext
			`,
			map: ({
				captions,
				files,
				...rest
			}) => ({
				images: files.map((file, index) => ({
					caption: captions[index]?.text || null,
					files: [file]
				})),
				...rest
			})
		}],
		["aufklappElemente_galerie_BlockType", {
			fetch: cms => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
				id
				galleryIntroductionText: galerietext
			`,
			map: ({
				captions,
				files,
				...rest
			}) => ({
				images: files.map((file, index) => ({
					caption: captions[index]?.text || null,
					files: [file]
				})),
				...rest
			})
		}],
		["inhaltsbausteine_galerie_BlockType", {
			fetch: cms => `
				galleryIntroductionText: einleitungstextGallerie
				id
				images: bilder {
					...on bilder_BlockType {
						caption: bildunterschrift
						files: datei {
							${cms.fragments.asset}
						}
					}
				}
				isNumbered: nummerierung
			`
		}],
		["quersliderAufgabenElemente_galerie_BlockType", {
			fetch: cms => `
				captions: bildunterschriften_aufgabe {
					text: col1
				}
				files: bilder_aufgabe {
					${cms.fragments.asset}
				}
				id
				galleryIntroductionText: galerietext_aufgabe
			`,
			map: ({
				captions,
				files,
				...rest
			}) => ({
				images: files.map((file, index) => ({
					caption: captions[index]?.text || null,
					files: [file]
				})),
				...rest
			})
		}],
		["quersliderInhalt_galerie_BlockType", {
			fetch: cms => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
				id
				galleryIntroductionText: galerietext
			`,
			map: ({
				captions,
				files,
				...rest
			}) => ({
				images: files.map((file, index) => ({
					caption: captions[index]?.text || null,
					files: [file]
				})),
				...rest
			})
		}]
	]),
	async render({
		galleryIntroductionText,
		id,
		images,
		isNumbered
	}, {
		Error,
		contentTypeIDIf,
		helpers: {
			Image,
			License,
			Marker
		}
	}) {
		if (!images.length) {
			return Error.render({
				message: "Invalid attempt to render gallery without providing any images.",
				title: "Images missing"
			});
		}
		const figures = await Promise.all(images.map(async image => {
			const imageCaptionHTML = image.caption
				? `<figcaption>${image.caption}</figcaption>`
				: "";
			return `
				<figure figure-type="gallery">
					${await Image.render({ asset: image.files[0] })}
					${License.render({ asset: image.files[0] })}
					${imageCaptionHTML}
				</figure>
			`;
		}));
		const galleryIntroductionTextHTML = galleryIntroductionText
			? `<div class="gallery-text">${galleryIntroductionText}</div>`
			: "";
		return `
			<section content-type="gallery" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					${galleryIntroductionTextHTML}
					<details>
						<summary>${figures[0]}</summary>
						${figures.slice(1).join("")}
					</details>
				</inner-content>
			</section>
		`;
	}
};