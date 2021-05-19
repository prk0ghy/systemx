export default {
	queries: new Map([
		["elemente_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift_nested
				html: h5p_slider
				id
			`
		}],
		["elemente_nested_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["inhalt_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift
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
