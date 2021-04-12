export default {
	/*
	* Unfortunately, the current CraftCMS back end defines class names for all boxes.
	* For instance, there's a class name called "box-teal", where the "box-" prefix is superfluous.
	*
	* Next, there's also `box-{0..10}`, for which I could not find any definition. Hence, it is up
	* to the editor to use a correct class name. We'll just default to gray boxes if it contains a digit.
	*
	* In the long run, we'd want to tackle that in CraftCMS. But for now, we'll do the mapping here.
	*/
	getBoxType(colorClassName) {
		return /\d/.test(colorClassName)
			? "gray"
			: colorClassName
				.replace(/^box-/, "")
				.replace("grey", "gray");
	},
	queries: new Map([
		["inhaltsbausteine_aufklappkasten_BlockType", {
			fetch: ({ types }) => `
				__typename
				colorClassName: Farbe
				content: inhaltDesKastens {
					...on inhaltDesKastens_BlockType {
						elements: elemente {
							__typename
							...on elemente_audioDatei_BlockType {
								${types.elemente_audioDatei_BlockType}
							}
							...on elemente_galerie_BlockType {
								${types.elemente_galerie_BlockType}
							}
							...on elemente_textMitOhneBild_BlockType {
								${types.elemente_textMitOhneBild_BlockType}
							}
							...on elemente_ueberschrift_BlockType {
								${types.elemente_ueberschrift_BlockType}
							}
						}
					}
				}
				headline: boxHeader
				id
				isNumbered: nummerierung
				source: quellenangaben
				summary: zusammenfassung
			`
		}]
	]),
	async render({
		content: [content],
		colorClassName,
		headline,
		isNumbered,
		source,
		summary
	}, {
		helpers: {
			Marker
		},
		render
	}) {
		const contentHTML = (await Promise.all(content.elements.map(child => render(child)))).join("");
		const footerHTML = source
			? `<footer>${source}</footer>`
			: "";
		const summaryHTML = summary
			? `<p>${summary}</p>`
			: "";
		return `
			<section box-type="${this.getBoxType(colorClassName)}" content-type="box">
				<inner-content>
					${Marker.render({ isNumbered })}
					<details class="box-wrap">
						<summary>
							<box-caption>
								<h3>${headline}</h3>
								${summaryHTML}
							</box-caption>
						</summary>
						<box-content>
							${contentHTML}
							${footerHTML}
						</box-content>
					</details>
				</inner-content>
			</section>
		`;
	}
};
