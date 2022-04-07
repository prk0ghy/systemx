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
	splitIntoFigureRows(figures, columns) {
		const figureRows = [];
		let start = 0;
		if (figures.length > 4 && figures.length % columns === 1) {
			start = 2;
			const figure = figures.slice(0, 2).join("");
			figureRows.push(`<figure-row figure-cols="2">${figure}</figure-row>`);
		}
		for(let i = start; i < figures.length; i += columns) {
			const figure = figures.slice(i, i + columns).join("");
			const ccols = i + columns >= figures.length
				? figures.length - i
				: columns;
			figureRows.push(`<figure-row figure-cols="${ccols}">${figure}</figure-row>`);
		}
		return figureRows;
	},
	splitFigureRows(figures) {
		switch (figures.length) {
		case 1:
			return figures;
		case 2:
		case 4:
			return this.splitIntoFigureRows(figures, 2);
		default:
			return this.splitIntoFigureRows(figures, 3);
		}
	},
	queries: new Map([
		["aufgabeElemente_textMitOhneBild_BlockType", {
			fetch: cms => `
				id
				images: bilder {
					${cms.fragments.asset || "WRONG_ORDER-aαδω"}
				}
				hideButtons
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: bildunterschrift
				text
			`,
			map: ({
				galleryIntroductionText,
				images,
				...rest
			}) => ({
				images: images.map((image, i) => ({
					caption: i === 0
						? galleryIntroductionText
						: null,
					files: [image]
				})),
				...rest
			})
		}],
		["aufklappAufgabenElemente_textMitOhneBild_BlockType", {
			fetch: ({fragments}) => `
				id
				images: bilder {
					${fragments.asset}
				}
				hideButtons
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: bildunterschrift
				text
			`,
			map: ({
				galleryIntroductionText,
				images,
				...rest
			}) => ({
				images: images.map((image, i) => ({
					caption: i === 0
						? galleryIntroductionText
						: null,
					files: [image]
				})),
				...rest
			})
		}],
		["aufklappElemente_textMitOhneBild_BlockType", {
			fetch: ({fragments}) => `
				id
				images: bilder {
					${fragments.asset}
				}
				hideButtons
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: bildunterschrift
				text
			`,
			map: ({
				galleryIntroductionText,
				images,
				...rest
			}) => ({
				images: images.map((image, i) => ({
					caption: i === 0
						? galleryIntroductionText
						: null,
					files: [image]
				})),
				...rest
			})
		}],
		["inhaltsbausteine_textMitOhneBild_BlockType", {
			fetch: ({fragments}) => `
				displayInOneLine: flex
				id
				images: bilder {
					...on bilder_BlockType {
						caption: bildunterschrift
						files: datei {
							${fragments.asset}
						}
					}
				}
				hideButtons
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: einleitungstextGallerie
				isNumbered: nummerierung
				starSelection: stern_selection
				infoLink
				text
			`,
			map: ({
				starSelection,
				isNumbered,
				...rest
			}) => ({
				starSelection,
				isNumbered: (isNumbered && ((starSelection === false) || (!starSelection))),
				...rest
			})
		}],
		["quersliderAufgabenElemente_textMitOhneBild_BlockType", {
			fetch: ({fragments}) => `
				id
				images: bilder {
					${fragments.asset}
				}
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: bildunterschrift
				text
			`,
			map: ({
				galleryIntroductionText,
				images,
				...rest
			}) => ({
				images: images.map((image, i) => ({
					caption: i === 0
						? galleryIntroductionText
						: null,
					files: [image]
				})),
				...rest
			})
		}],
		["quersliderInhalt_textMitOhneBild_BlockType", {
			fetch: ({fragments}) => `
				id
				images: bilder {
					${fragments.asset}
				}
				hideButtons
				imageWidth: bildbreite
				imagePosition: bildposition
				galleryIntroductionText: bildunterschrift
				text
			`,
			map: ({
				galleryIntroductionText,
				images,
				...rest
			}) => ({
				images: images.map((image, i) => ({
					caption: i === 0
						? galleryIntroductionText
						: null,
					files: [image]
				})),
				...rest
			})
		}]
	]),
	renderFigure({
		caption,
		imageHTML,
		licenseHTML,
		position,
		hideButtons,
		width
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<figure figure-position="${position}" figure-type="picture" figure-width="${width}" hide-buttons="${hideButtons ? 1 : 0}">
				${imageHTML}
				${licenseHTML}
				${captionHTML}
			</figure>
		`;
	},
	async render({
		displayInOneLine = false,
		id,
		hideButtons = false,
		images,
		imageWidth,
		imagePosition,
		infoLink = "",
		galleryIntroductionText,
		isNumbered,
		starSelection,
		text
	}, {
		attributeIf,
		contentTypeIDIf,
		helpers: {
			Image,
			InfoLink,
			License,
			Marker
		}
	}) {
		const mappedImageWidth = this.getFigureWidth(imageWidth);
		const mappedImagePosition = this.getFigurePosition(imagePosition);

		const figures = (await Promise.all(
			images?.map(async image => await this.renderFigure({
				caption: image.caption,
				imageHTML: await Image.render({ asset: image?.files?.[0], imageSize: mappedImageWidth }),
				licenseHTML: await License.render({ asset: image?.files?.[0] }),
				position: mappedImagePosition,
				width: mappedImageWidth,
				hideButtons
			})))
		);
		const figureHTML = displayInOneLine
			? this.splitFigureRows(figures).join("")
			: figures.join("");
		const galleryIntroductionHTML = galleryIntroductionText
			? `<gallery-introduction-text>${galleryIntroductionText}</gallery-introduction-text>`
			: "";
		return `
			<section content-type="text-and-image" ${contentTypeIDIf(id)} ${attributeIf("star-selection",starSelection)}>
				${Marker.render({ isNumbered })}
				${InfoLink.render({infoLink})}
				<inner-content>
					${figureHTML}
					${galleryIntroductionHTML}
					<div class="text-content">
						${text ?? ""}
					</div>
				</inner-content>
			</section>
		`;
	}
};
