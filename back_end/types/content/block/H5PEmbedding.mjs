export default {
	queries: new Map([
		["aufgabeElemente_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["quersliderAufgabenElemente_h5p_BlockType", {
			fetch: () => `
				__typename
				html: h5p_embed
				id
			`
		}],
		["quersliderInhalt_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift
				html: h5p_slider
				id
			`
		}],
		["aufklappAufgabenElemente_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["aufklappElemente_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift_nested
				html: h5p_slider
				id
			`
		}],
		["inhaltsbausteine_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift_h5p
				html: h5p
				id
				isNumbered: nummerierung
			`
		}]
	]),
	async render({
		caption,
		id,
		isNumbered,
		html
	}, {
		contentTypeIDIf,
		helpers: {
			Marker
		}
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="embedding" ${contentTypeIDIf(id)} embedding-type="h5p">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="embedding">
						${html}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
