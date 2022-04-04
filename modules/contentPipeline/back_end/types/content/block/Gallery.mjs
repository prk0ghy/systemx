export default {
	queries: new Map([
		["aufgabeElemente_galerie_BlockType", {
			fetch: ({fragments}) => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${fragments.asset}
				}
				galleryIntroductionText: galerietext
				id
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
			fetch: ({fragments}) => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${fragments.asset}
				}
				galleryIntroductionText: galerietext
				id
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
			fetch: ({fragments}) => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${fragments.asset}
				}
				galleryIntroductionText: galerietext
				id
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
			fetch: ({ fragments }) => `
				custom
				galleryIntroductionText: einleitungstextGallerie
				id
				images: bilder {
					...on bilder_BlockType {
						caption: bildunterschrift
						files: datei {
							${fragments.asset}
						}
					}
				}
				isNumbered: nummerierung
				starSelection: stern_selection
			`,
			map: ({
				custom,
				isNumbered,
				starSelection,
				...rest
			}) => ({
				isNumbered: isNumbered && (starSelection === "false" || !starSelection),
				previewDisplayMode: custom === "standard" || !custom
					? "cover"
					: "contain",
				starSelection,
				...rest
			})
		}],
		["quersliderAufgabenElemente_galerie_BlockType", {
			fetch: ({ fragments }) => `
				captions: bildunterschriften_aufgabe {
					text: col1
				}
				files: bilder_aufgabe {
					${fragments.asset}
				}
				galleryIntroductionText: galerietext_aufgabe
				id
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
			fetch: ({ fragments }) => `
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${fragments.asset}
				}
				galleryIntroductionText: galerietext
				id
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
		infoLink = null,
		images,
		isNumbered,
		previewDisplayMode = "cover",
		starSelection,
		text = null
	}, {
		attributeIf,
		contentTypeIDIf,
		Error,
		helpers: {
			Image,
			InfoLink,
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
				: `<figcaption></figcaption>`;
			return `
				<figure display-mode="${previewDisplayMode}" figure-type="gallery">
					${await Image.render({ asset: image.files[0], imageSize: 100 })}
					${License.render({ asset: image.files[0] })}
					${imageCaptionHTML}
				</figure>
			`;
		}));
		const galleryIntroductionTextHTML = galleryIntroductionText
			? `<div class="gallery-text">${galleryIntroductionText}</div>`
			: "";
		return `
			<section content-type="gallery" ${contentTypeIDIf(id)} ${attributeIf("star-selection",starSelection)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					${InfoLink.render({infoLink})}
					<details>
						<summary>${figures[0]}</summary>
						${figures.slice(1).join("")}
					</details>
					${galleryIntroductionTextHTML}
					${text ?? ""}
				</inner-content>
			</section>
		`;
	}
};
