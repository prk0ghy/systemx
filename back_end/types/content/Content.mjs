export default {
	queries: new Map([
		["inhalt_inhalt_Entry", {
			fetch: ({
				fragments,
				typeCollections
			}) => `
				elements: ${typeCollections.elements}
				heroImageCaption: bildunterschrift
				heroImages: heroimage {
					${fragments.asset}
				}
				titleOverride: title_override
			`
		}]
	]),
	async render({
		id,
		title
	}, {
		cms,
		contentTypes: {
			Headline,
			HeroImage
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
		const children = await Promise.all(content.entry.elements.map(element => render(element)));
		const heroImageHTML = content.entry.heroImages.length
			? await HeroImage.render({
				caption: content.entry.heroImageCaption,
				images: content.entry.heroImages,
				uid: `${id}-hero-image`
			})
			: "";
		const headlineHTML = Headline.render({
			headline: content.entry.titleOverride || title,
			tag: "h1"
		});
		return `
			${heroImageHTML}
			${headlineHTML}
			${children.join("")}
		`;
	}
};
