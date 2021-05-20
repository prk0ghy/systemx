export default {
	queries: new Map([
		["glossar_glossar_Entry", {
			fetch: ({ fragments }) => `
				__typename
				title
				elements: ${fragments.elements}
			`
		}]
	]),
	async render({
		id,
		title
	}, {
		cms,
		contentTypeIDIf,
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
			<main content-type="glossary" ${contentTypeIDIf(id)}>
				${headlineHTML}
				${children.join("")}
			</main>
		`;
	}
};
