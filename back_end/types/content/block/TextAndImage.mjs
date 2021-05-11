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
	splitIntoFigureRows(figures,cols){
		const ret = [];
		let start = 0;
		if((figures.length > 4) && ((figures.length % cols) === 1)){
			start = 2;
			const fig = figures.slice(0,2).join("");
			ret.push(`<figure-row figure-cols="2">${fig}</figure-row>`);
		}
		for(let i=start;i<figures.length;i+=cols){
			const fig = figures.slice(i,i+cols).join("");
			const ccols = i+cols >= figures.length ? figures.length - i : cols;
			ret.push(`<figure-row figure-cols="${ccols}">${fig}</figure-row>`);
		}
		return ret;
	},
	splitFigureRows(figures){
		switch(figures.length){
		case 1:
			return figures;
		case 2:
		case 4:
			return this.splitIntoFigureRows(figures,2);
		default:
			return this.splitIntoFigureRows(figures,3);
		}
	},
	queries: new Map([
		["elemente_nested_textMitOhneBild_BlockType", {
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
		["inhalt_textMitOhneBild_BlockType", {
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
	async render({
		displayInOneLine = false,
		images,
		imageWidth,
		imagePosition,
		galleryIntroductionText,
		isNumbered,
		text
	}, {
		contentTypes: {
			Gallery
		},
		helpers: {
			Image,
			Marker
		}
	}) {
		const mappedImageWidth = this.getFigureWidth(imageWidth);
		const mappedImagePosition = this.getFigurePosition(imagePosition);
		const figureHTML = displayInOneLine || images?.length && images.length <= 1
			? this.splitFigureRows((await Promise.all(
				images?.map(async image => await this.renderFigure({
					caption: image.caption,
					imageHTML: await Image.render({ asset: image?.files?.[0] }),
					position: mappedImagePosition,
					width: mappedImageWidth
				})))
			)).join("")
			: images?.length && images.length >= 2
				? await Gallery.render({
					images
				})
				: "";
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
		imageHTML,
		position,
		width
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<figure figure-position="${position}" figure-type="picture" figure-width="${width}" one-line="true">
				${imageHTML}
				${captionHTML}
			</figure>
		`;
	}
};
