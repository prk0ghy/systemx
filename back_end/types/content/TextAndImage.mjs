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
		function mapWidth(width){
			switch(width){
			case "38.2":
				return "30";
			case "61.8":
				return "50";
			case "100":
			default:
				return "100";
			}
		}

		function mapPosition(position){
			switch(position){
			case "linksImText":
			default:
				return "left";
			case "rechtsImText":
				return "right";
			}
		}

		function renderImageFigure(singleImage, imageWidth, imagePosition, displayInOneLine){
			const figcaption = singleImage.caption ? `<figcaption>${singleImage.caption}</figcaption>` : "";
			return `
				<figure figure-position="${imagePosition}" figure-type="picture" figure-width="${imageWidth}" one-line="${displayInOneLine}">
					${Image.render({asset: singleImage?.image?.[0]})}
					${figcaption}
				</figure>
			`;
		}
		const mappedImageWidth = mapWidth(imageWidth);
		const mappedImagePosition = mapPosition(imagePosition);
		const imageHTML = images.map((i) => renderImageFigure(i, mappedImageWidth, mappedImagePosition, displayInOneLine)).join("");
		const galleryIntroductionHTML = galleryIntroductionText ? `<gallery-introduction-text>${galleryIntroductionText}</gallery-introduction-text>` : "";

		return `
			<section content-type="text-and-image">
				<inner-content>
					${Marker.render({ isNumbered })}
					${imageHTML}
					${galleryIntroductionHTML}
					${text ? text : ""}
				</inner-content>
			</section>
		`;
	}
};
