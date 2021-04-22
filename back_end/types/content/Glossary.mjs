export default {
	queries: new Map([
		["glossar_glossar_Entry", {
			fetch: ({ typeCollections }) => `
				title
				elements: ${typeCollections.elements}
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
