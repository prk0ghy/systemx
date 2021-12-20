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
							...on aufklappElemente_audioDatei_BlockType {
								${types.aufklappElemente_audioDatei_BlockType}
							}
							...on aufklappElemente_aufgabe_BlockType {
								${types.aufklappElemente_aufgabe_BlockType}
							}
							...on aufklappElemente_download_BlockType {
								${types.aufklappElemente_download_BlockType}
							}
							...on aufklappElemente_embeddedVideoAudio_BlockType {
								${types.aufklappElemente_embeddedVideoAudio_BlockType}
							}
							...on aufklappElemente_tabellen_BlockType {
								${types.aufklappElemente_tabellen_BlockType}
							}
							...on aufklappElemente_tabulator_BlockType {
								${types.aufklappElemente_tabulator_BlockType}
							}
							...on aufklappElemente_galerie_BlockType {
								${types.aufklappElemente_galerie_BlockType}
							}
							...on aufklappElemente_h5p_BlockType {
								${types.aufklappElemente_h5p_BlockType}
							}
							...on aufklappElemente_textMitOhneBild_BlockType {
								${types.aufklappElemente_textMitOhneBild_BlockType}
							}
							...on aufklappElemente_ueberschrift_BlockType {
								${types.aufklappElemente_ueberschrift_BlockType}
							}
							...on aufklappElemente_videoDatei_BlockType {
								${types.aufklappElemente_videoDatei_BlockType}
							}
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
				<inner-content>
					${Marker.render({ isNumbered })}
					${await HelpVideo.render({ asset: helpVideo })}
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