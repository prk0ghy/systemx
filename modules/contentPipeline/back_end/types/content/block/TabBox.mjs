export default {
	getType(type) {
		return type === "aufgabenkasten"
			? "exercise"
			: type === "foerderfenster"
				? "support"
				: "mixed";
	},
	queries: new Map([
		["inhaltsbausteine_querslider_BlockType", {
			fetch: ({
				fragments,
				types
			}) => `
				helpVideos: hilfsvideo_qs {
					${fragments.asset}
				}
				id
				isNumbered: nummerierung
				tabs {
					...on tabs_BlockType {
						contents: quersliderInhalt {
							__typename
							${Object.keys(types).filter(k => k.startsWith("quersliderInhalt_")).map(k => `... on ${k} { ${types[k]} }`)}
						}
						media: tabMedia {
							${fragments.asset}
						}
						title: bezeichnung
						source: quellenangaben_q
					}
				}
				type: kastentyp
			`,
			map: ({
				helpVideos,
				tabs,
				type,
				isNumbered,
				...rest
			}) => ({
				helpVideo: helpVideos[0],
				type,
				isNumbered: ((type !== "stern_differenzierung") && isNumbered),
				tabs: tabs.map(tab => Object.assign({}, tab, {
					media: tab.media[0]
				})),
				...rest
			})
		}]
	]),
	async render({
		helpVideo,
		id,
		isNumbered,
		tabs,
		type
	}, {
		attributeIf,
		classIf,
		contentTypeIDIf,
		helpers: {
			HelpVideo,
			Marker
		},
		render
	}) {
		const starSelection = ((type === 'stern_differenzierung') && type);
		const tabHeaders = tabs.map((tab, index) => `
			<tab-box-header
				${classIf(index === 0, "active")}
				tab-index="${index}"
			>
				${tab.title}
			</tab-box-header>
		`).join("");
		const tabSource = tabs.map((tab, index) => tab?.source ? `
			<tab-box-source tab-index="${index}">
				${tab.source}
			</tab-box-source>
		` : "").join("");
		const tabContents = (await Promise.all(tabs.map(async (tab, index) => {
			const contentsHTML = (await Promise.all(tab.contents.map(content => render(content)))).join("");
			return `
				<tab-box-content
					${classIf(index === 0, "active")}
					tab-index="${index}"
					${attributeIf("tab-media", tab.media?.url)}
				>
					${contentsHTML}
				</tab-box-content>
			`;
		}))).join("");
		const boxType = this.getType(type);
		return `
			<section
				content-type="tab-box"
				${contentTypeIDIf(id)}
				tab-box-type="${boxType}"
				${attributeIf("star-selection",starSelection)}
			>
				<inner-content>
					${Marker.render({ isNumbered })}
					${await HelpVideo.render({ asset: helpVideo })}
					<tab-box-header-wrap>
						${tabHeaders}
					</tab-box-header-wrap>
					<tab-box-content-wrap>
						${tabContents}
						${tabSource}
						<tab-paging>
							<previous-tab></previous-tab>
							<next-tab></next-tab>
						</tab-paging>
					</tab-box-content-wrap>
				</inner-content>
			</section>
		`;
	}
};
