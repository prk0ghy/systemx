export default {
	queries: new Map([
		["inhaltsbausteine_ueberschrift_BlockType", () => `
			__typename
			headline: ueberschrift
			isNumbered: nummerierung
		`]
	]),
	render({
		headline,
		isNumbered
	}, {
		helpers: {
			Marker
		}
	}) {
		return `
			<section content-type="headline">
				<inner-content>
					${Marker.render({ isNumbered })}
					<h3>${headline}</h3>
				</inner-content>
			</section>
		`;
	}
};
