export default {
	queries: new Map([
		["inhalt_inhalt_Entry", {
			fetch: ({ fragments }) => `
				elements: ${fragments.elements}
				heroImageCaption: bildunterschrift
				heroImages: heroimage {
					${fragments.asset}
				}
				id
				title
				titleOverride: title_override
			`
		}]
	]),
	async render({
		elements,
		heroImageCaption,
		heroImages,
		id,
		title,
		titleOverride
	}, {
		contentTypeIDIf,
		contentTypes: {
			Headline,
			HeroImage
		},
		render
	}) {
		const children = await Promise.all(elements.map(element => render(element)));
		const heroImageHTML = heroImages.length
			? await HeroImage.render({
				caption: heroImageCaption,
				images: heroImages,
				uid: `${id}-hero-image`
			})
			: "";
		const headlineHTML = Headline.render({
			headline: titleOverride || title,
			tag: "h1"
		});
		return `
			<main content-type="content" ${contentTypeIDIf(id)}>
				${heroImageHTML}
				${headlineHTML}
				${children.join("")}
			</main>
		`;
	}
};
