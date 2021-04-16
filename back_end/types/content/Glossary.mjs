export default {
	queries: new Map([
		["glossar_glossar_Entry", {
			fetch: ({
				fragments,
				types
			}) => `
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
		const children = await Promise.all(content.entry.elements.map(element => render(element)));
		return `
			<section content-type="headline">
				<inner-content>
					<h1 class="content-title inner-content">${title}</h1>
				</inner-content>
			</section>
			${children.join("")}
		`;
	}
};
