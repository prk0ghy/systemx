import {request, gql} from "graphql-request";

const scope = {
	get content() {
		return `
			elements: inhaltsbausteine {
				__typename
				...on inhaltsbausteine_textMitOhneBild_BlockType {
					${scope.textAndImage}
				}
				...on inhaltsbausteine_ueberschrift_BlockType {
					${scope.header}
				}
				...on inhaltsbausteine_videoDatei_BlockType {
					${scope.video}
				}
				...on inhaltsbausteine_heroimage_BlockType {
					${scope.heroimage}
				}
			}
			titleOverride: title_override
		`;
	},
	get entry() {
		return `
			__typename
			dateUpdated
			id
			title
			uid
			uri
		`;
	},
	get header() {
		return `
			__typename
			headline: ueberschrift
			isNumbered: nummerierung
		`;
	},
	get image() {
		return `
			__typename
			image: datei {
				url
			}
			caption: bildunterschrift
			`;
	},
	get textAndImage() {
		return `
			__typename
			images: bilder {
				__typename
				...on bilder_BlockType {
					${scope.image}
				}
			}
			imageWidth: bildbreite
			imageBorder: bilderrahmen
			imagePosition: bildposition
			galleryIntroductionText: einleitungstextGallerie
			isNumbered: nummerierung
			text
			useFlex: flex
		`;
	},
	get video() {
		return `
			__typename
			caption: videoUnterschrift
			files: datei {
				url
			}
			isNumbered: nummerierung
			poster: posterbild {
				url
			}
		`;
	},
	get heroimage() {
		return `
			id
			uid
			images: bild {
				__typename
				id
				uid
				filename
				url
				title
			}
		`;
	},
};
export default queryFunction => request("https://lasub-dev.test-dilewe.de/api", gql([
	`{ ${queryFunction(scope)} }`
		.replace(/[\t]/g, "")
		.replace(/[\n]/g, " ")
		.trim()
]));
