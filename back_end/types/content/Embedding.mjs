export default {
	queries: new Map([
		["elemente_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift_nested
				html: h5p_slider
			`
		}],
		["inhaltsbausteine_h5p_BlockType", {
			fetch: () => `
				__typename
				caption: unterschrift_h5p
				isNumbered: nummerierung
				html: h5p
			`
		}]
	]),
	async render({
		caption,
		isNumbered,
		html
	}, {
		helpers: {
			Marker
		}
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="embedding" embedding-type="h5p">
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
