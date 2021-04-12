export default {
	queries: new Map([
		["inhaltsbausteine_galerie_BlockType", cms => `
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
		`]
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
		const figures = images.map(image => {
			const imageCaptionHTML = image.caption
				? `<figcaption>${image.caption}</figcaption>`
				: "";
			return `
				<figure figure-type="gallery">
					${Image.render({ asset: image.files[0] })}
					${License.render({ asset: image.files[0] })}
					${imageCaptionHTML}
				</figure>
			`;
		});
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
