export default {
	getFigureWidth(width) {
		switch (width) {
		case "38.2":
			return "30";
		case "61.8":
			return "50";
		case "100":
		default:
			return "100";
		}
	},
	getFigurePosition(position) {
		switch (position) {
		case "linksImText":
		default:
			return "left";
		case "rechtsImText":
			return "right";
		}
	},
	queries: new Map([
		["elemente_textMitOhneBild_BlockType", {
			fetch: cms => `
				__typename
				images: bilder {
					__typename
					${cms.fragments.asset}
				}
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: bildunterschrift
				text
			`,
			map: ({
				images,
				...rest
			}) => ({
				images: images.map(image => ({
					caption: null,
					files: [image]
				})),
				...rest
			})
		}],
		["inhaltsbausteine_textMitOhneBild_BlockType", {
			fetch: cms => `
				__typename
				displayInOneLine: flex
				images: bilder {
					__typename
					...on bilder_BlockType {
						caption: bildunterschrift
						files: datei {
							${cms.fragments.asset}
						}
					}
				}
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: einleitungstextGallerie
				isNumbered: nummerierung
				text
			`
		}]
	]),
	render({
		displayInOneLine = false,
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
		const mappedImageWidth = this.getFigureWidth(imageWidth);
		const mappedImagePosition = this.getFigurePosition(imagePosition);
		const figureHTML = images
			?.map(image => this.renderFigure({
				caption: image.caption,
				displayInOneLine,
				imageHTML: Image.render({ asset: image?.files?.[0] }),
				width: mappedImageWidth,
				position: mappedImagePosition
			})).join("");
		const galleryIntroductionHTML = galleryIntroductionText
			? `<gallery-introduction-text>${galleryIntroductionText}</gallery-introduction-text>`
			: "";
		return `
			<section content-type="text-and-image">
				<inner-content>
					${Marker.render({ isNumbered })}
					${figureHTML}
					${galleryIntroductionHTML}
					${text ?? ""}
				</inner-content>
			</section>
		`;
	},
	renderFigure({
		caption,
		displayInOneLine,
		imageHTML,
		position,
		width
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<figure figure-position="${position}" figure-type="picture" figure-width="${width}" one-line="${displayInOneLine}">
				${imageHTML}
				${captionHTML}
			</figure>
		`;
	}
};
