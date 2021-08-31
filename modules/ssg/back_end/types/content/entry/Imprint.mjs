export default {
	queries: new Map([
		["impressum_impressum_Entry", {
			fetch: ({ fragments }) => `
				elements: ${fragments.elements}
				id
				title
			`
		}]
	]),
	async render({
		elements,
		id,
		title
	}, {
		contentTypeIDIf,
		contentTypes: {
			Headline
		},
		render
	}) {
		const children = await Promise.all(elements.map(element => render(element, {
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
