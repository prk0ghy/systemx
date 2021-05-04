export default {
	queries: new Map([
		["elemente_galerie_BlockType", {
			fetch: cms => `
				__typename
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
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
		["elemente_nested_galerie_BlockType", {
			fetch: cms => `
				__typename
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
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
		["inhalt_galerie_BlockType", {
			fetch: cms => `
				__typename
				captions: bildunterschriften {
					text: col1
				}
				files: bilder {
					${cms.fragments.asset}
				}
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
				__typename
				galleryIntroductionText: einleitungstextGallerie
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
		}]
	]),
	async render({
		galleryIntroductionText,
		images,
		isNumbered
	}, {
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
			<section content-type="gallery">
				<inner-content>
					${Marker.render({ isNumbered })}
					${galleryIntroductionTextHTML}
					<details>
						<summary>${figures[0]}</summary>
						${figures.slice(1)}
					</details>
				</inner-content>
			</section>
		`;
	}
};
