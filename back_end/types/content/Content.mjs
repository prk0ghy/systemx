export default {
	queries: new Map([
		["inhalt_inhalt_Entry", ({
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
				...on inhaltsbausteine_galerie_BlockType {
					${types.inhaltsbausteine_galerie_BlockType}
				}
				...on inhaltsbausteine_h5p_BlockType {
					${types.inhaltsbausteine_h5p_BlockType}
				}
				...on inhaltsbausteine_heroimage_BlockType {
					${types.inhaltsbausteine_heroimage_BlockType}
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
		`]
	]),
	async render({
		id,
		title
	}, {
		cms,
		contentTypes: {
			HeroImage
		},
		query,
		render,
		type
	}) {
		const content = await query(() => `
			entry(id: ${id}) {
				...on ${type} {
					${this.queries.get(type)(cms)}
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
		return `
			${heroImageHTML}
			<section content-type="headline">
				<inner-content>
					<h1 class="content-title inner-content">${content.entry.titleOverride || title}</h1>
				</inner-content>
			</section>
			${children.join("")}
		`;
	}
};
