export default {
	queries: new Map([
		["inhalt_inhalt_Entry", {
			fetch: ({
				fragments,
				types
			}) => `
				elements: inhaltsbausteine {
					__typename
					...on inhaltsbausteine_audioDatei_BlockType {
						${types.inhaltsbausteine_audioDatei_BlockType}
					}
					...on inhaltsbausteine_aufklappkasten_BlockType {
						${types.inhaltsbausteine_aufklappkasten_BlockType}
					}
					...on inhaltsbausteine_download_BlockType {
						${types.inhaltsbausteine_download_BlockType}
					}
					...on inhaltsbausteine_galerie_BlockType {
						${types.inhaltsbausteine_galerie_BlockType}
					}
					...on inhaltsbausteine_h5p_BlockType {
						${types.inhaltsbausteine_h5p_BlockType}
					}
					...on inhaltsbausteine_heroimage_BlockType {
						${types.inhaltsbausteine_heroimage_BlockType}
					}
					...on inhaltsbausteine_tabulator_BlockType {
						${types.inhaltsbausteine_tabulator_BlockType}
					}
					...on inhaltsbausteine_textMitOhneBild_BlockType {
						${types.inhaltsbausteine_textMitOhneBild_BlockType}
					}
					...on inhaltsbausteine_trennerbild_BlockType {
						${types.inhaltsbausteine_trennerbild_BlockType}
					}
					...on inhaltsbausteine_ueberschrift_BlockType {
						${types.inhaltsbausteine_ueberschrift_BlockType}
					}
					...on inhaltsbausteine_videoDatei_BlockType {
						${types.inhaltsbausteine_videoDatei_BlockType}
					}
				}
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
