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
			? "invalid"
			: colorClassName
				.replace(/^box-/, "")
				.replace("blau", "blue")
				.replace("grey", "gray");
	},
	queries: new Map([
		["inhaltsbausteine_aufklappkasten_BlockType", {
			fetch: ({
				fragments,
				types
			}) => `
				colorClassName: Farbe
				content: inhaltDesKastens {
					...on inhaltDesKastens_BlockType {
						elements: aufklappElemente {
							__typename
							${Object.keys(types).filter(k => k.startsWith("aufklappElemente_")).map(k => `... on ${k} { ${types[k]} }`)}
						}
					}
				}
				headline: boxHeader
				helpVideos: hilfsvideo {
					${fragments.asset}
				}
				id
				isNumbered: nummerierung
				source: quellenangaben
				summary: zusammenfassung
			`,
			map: ({
				helpVideos,
				...rest
			}) => ({
				helpVideo: helpVideos[0],
				...rest
			})
		}]
	]),
	async render({
		content: [content],
		colorClassName,
		headline,
		helpVideo,
		id,
		isNumbered,
		source,
		summary
	}, {
		contentTypeIDIf,
		EditorialError,
		helpers: {
			HelpVideo,
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
		const boxType = this.getBoxType(colorClassName);
		const editorialWarning = boxType === "invalid"
			? EditorialError.render({
				message: "Please assign a color to the box below."
			})
			: "";
		return `
			${editorialWarning}
			<section box-type="${boxType}" content-type="box" ${contentTypeIDIf(id)}>
				${Marker.render({ isNumbered })}
				${await HelpVideo.render({ asset: helpVideo })}
				<inner-content>
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
