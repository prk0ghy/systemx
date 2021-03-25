export default {
	queries: new Map([
		["inhaltsbausteine_textMitOhneBild_BlockType", cms => `
			__typename
			displayInOneLine: flex
			images: bilder {
				__typename
				...on bilder_BlockType {
					caption: bildunterschrift
					image: datei {
						${cms.fragments.asset}
					}
				}
			}
			imageWidth: bildbreite
			imagePosition: bildposition
			galleryIntroductionText: einleitungstextGallerie
			isNumbered: nummerierung
			text
		`]
	]),
	render({
		displayInOneLine,
		images,
		imageWidth,
		imagePosition,
		galleryIntroductionText,
		isNumbered,
		text
	}, {
		helpers: {
			Image,
			Marker
		}
	}) {
		const image = images?.[0]?.image?.[0] ?? null;
		const galleryImages = image
			? images
			: null;
		const imageHTML = images
			? images.map(({ image: [image] }) => Image.render({
				asset: image
			})).join("")
			: "";
		return `
			<section content-type="text-and-image">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-position="${imagePosition}" figure-type="picture" figure-width="${imageWidth}" one-line="${displayInOneLine}">
						${imageHTML}
						${text
							? `<figcaption>${text}</figcaption>`
							: ""
						}
						${galleryIntroductionText
							? `<gallery-introduction-text>${galleryIntroductionText}</gallery-introduction-text>`
							: ""
						}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
