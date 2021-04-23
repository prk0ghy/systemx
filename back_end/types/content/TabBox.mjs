export default {
	queries: new Map([
		["inhaltsbausteine_querslider_BlockType", {
			fetch: ({ types }) => `
				__typename
				isNumbered: nummerierung
				tabs {
					...on tabs_BlockType {
						contents: inhalt {
							__typename
							...on inhalt_audioDatei_BlockType {
								${types.inhalt_audioDatei_BlockType}
							}
							...on inhalt_aufgabe_BlockType {
								${types.inhalt_aufgabe_BlockType}
							}
							...on inhalt_download_BlockType {
								${types.inhalt_download_BlockType}
							}
							...on inhalt_embeddedVideoAudio_BlockType {
								${types.inhalt_embeddedVideoAudio_BlockType}
							}
							...on inhalt_galerie_BlockType {
								${types.inhalt_galerie_BlockType}
							}
							...on inhalt_h5p_BlockType {
								${types.inhalt_h5p_BlockType}
							}
							...on inhalt_tabellen_BlockType {
								${types.inhalt_tabellen_BlockType}
							}
							...on inhalt_tabulator_BlockType {
								${types.inhalt_tabulator_BlockType}
							}
							...on inhalt_textMitOhneBild_BlockType {
								${types.inhalt_textMitOhneBild_BlockType}
							}
							...on inhalt_ueberschrift_BlockType {
								${types.inhalt_ueberschrift_BlockType}
							}
							...on inhalt_videoDatei_BlockType {
								${types.inhalt_videoDatei_BlockType}
							}
						}
						title: bezeichnung
					}
				}
			`
		}]
	]),
	async render({
		isNumbered,
		tabs
	}, {
		classIf,
		helpers: {
			Marker
		},
		render
	}) {
		const tabHeaders = tabs.map((tab, index) => `
			<tab-box-header ${classIf(index === 0, "active")} tab-index="${index}">
				${tab.title}
			</tab-box-header>
		`).join("");
		const tabContents = (await Promise.all(tabs.map(async (tab, index) => {
			const contentsHTML = (await Promise.all(tab.contents.map(content => render(content)))).join("");
			return `
				<tab-box-content ${classIf(index === 0, "active")} tab-index="${index}">
					${contentsHTML}
				</tab-box-content>
			`;
		}))).join("");
		return `
			<section content-type="tab-box">
				<inner-content>
					${Marker.render({ isNumbered })}
					<tab-box-header-wrap>
						${tabHeaders}
					</tab-box-header-wrap>
					<tab-box-content-wrap>
						${tabContents}
					</tab-box-content-wrap>
				</inner-content>
			</section>
		`;
	}
};
