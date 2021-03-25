export default {
	queries: new Map([
		["inhaltsbausteine_h5p_BlockType", cms => `
			__typename
			caption: unterschrift_h5p
			isNumbered: nummerierung
			html: h5p
		`]
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
		return `
			<section content-type="embedding" embedding-type="h5p">
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="embedding">
						${html}
						${caption
							? `<figcaption>${caption}</figcaption>`
							: ""
						}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
