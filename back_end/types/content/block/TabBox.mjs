export default {
	getType(type) {
		return type === "aufgabenkasten"
			? "exercise"
			: "mixed";
	},
	queries: new Map([
		["inhaltsbausteine_querslider_BlockType", {
			fetch: ({fragments, types }) => `
				id
				isNumbered: nummerierung
				tabs {
					...on tabs_BlockType {
						contents: quersliderInhalt {
							__typename
							...on quersliderInhalt_audioDatei_BlockType {
								${types.quersliderInhalt_audioDatei_BlockType}
							}
							...on quersliderInhalt_aufgabe_BlockType {
								${types.quersliderInhalt_aufgabe_BlockType}
							}
							...on quersliderInhalt_download_BlockType {
								${types.quersliderInhalt_download_BlockType}
							}
							...on quersliderInhalt_embeddedVideoAudio_BlockType {
								${types.quersliderInhalt_embeddedVideoAudio_BlockType}
							}
							...on quersliderInhalt_galerie_BlockType {
								${types.quersliderInhalt_galerie_BlockType}
							}
							...on quersliderInhalt_h5p_BlockType {
								${types.quersliderInhalt_h5p_BlockType}
							}
							...on quersliderInhalt_tabellen_BlockType {
								${types.quersliderInhalt_tabellen_BlockType}
							}
							...on quersliderInhalt_tabulator_BlockType {
								${types.quersliderInhalt_tabulator_BlockType}
							}
							...on quersliderInhalt_textMitOhneBild_BlockType {
								${types.quersliderInhalt_textMitOhneBild_BlockType}
							}
							...on quersliderInhalt_ueberschrift_BlockType {
								${types.quersliderInhalt_ueberschrift_BlockType}
							}
							...on quersliderInhalt_videoDatei_BlockType {
								${types.quersliderInhalt_videoDatei_BlockType}
							}
						}
						title: bezeichnung
						media: tabMedia {
							${fragments.asset}
						}
					}
				}
				type: kastentyp
			`
		}]
	]),
	async render({
		id,
		isNumbered,
		tabs,
		type
	}, {
		classIf,
		contentTypeIDIf,
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
			const resource = tab.media?.[0];
			const tabMedia = resource ? `tab-media="${resource?.url}"` : "";
			return `
				<tab-box-content ${classIf(index === 0, "active")} tab-index="${index}" ${tabMedia}>
					${contentsHTML}
				</tab-box-content>
			`;
		}))).join("");
		const boxType = this.getType(type);
		return `
			<section content-type="tab-box" ${contentTypeIDIf(id)} tab-box-type="${boxType}">
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
