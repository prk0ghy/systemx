export default {
	queries: new Map([
		["glossar_glossar_Entry", {
			fetch: ({ types }) => `
				title
				elements: inhaltsbausteine {
					__typename
					...on inhaltsbausteine_ueberschrift_BlockType {
						${types.inhaltsbausteine_ueberschrift_BlockType}
					}
					...on inhaltsbausteine_textMitOhneBild_BlockType {
						${types.inhaltsbausteine_textMitOhneBild_BlockType}
					}
					...on inhaltsbausteine_audioDatei_BlockType {
						${types.inhaltsbausteine_audioDatei_BlockType}
					}
					...on inhaltsbausteine_galerie_BlockType {
						${types.inhaltsbausteine_galerie_BlockType}
					}
					...on inhaltsbausteine_videoDatei_BlockType {
						${types.inhaltsbausteine_videoDatei_BlockType}
					}
				}
			`
		}]
	]),
	async render({
		id,
		title
	}, {
		cms,
		contentTypes: {
			Headline
		},
		query,
		render,
		type
	}) {
		const content = await query(() => `
			entry(id: ${id}) {
				...on ${type} {
					${this.queries.get(type).fetch(cms)}
				}
			}
		`);
		const children = await Promise.all(content.entry.elements.map(element => render(element, {
			renderMarkers: false
		})));
		const headlineHTML = Headline.render({
			headline: title,
			tag: "h1"
		});
		return `
			${headlineHTML}
			${children.join("")}
		`;
	}
};
