export default {
	queries: new Map([
		["elemente_ueberschrift_BlockType", () => `
			__typename
			headline: ueberschrift
			tag: groesse
		`],
		["inhaltsbausteine_ueberschrift_BlockType", () => `
			__typename
			headline: ueberschrift
			isNumbered: nummerierung
		`]
	]),
	render({
		headline,
		isNumbered,
		tag = "h3"
	}, {
		helpers: {
			Marker
		}
	}) {
		return `
			<section content-type="headline">
				<inner-content>
					${Marker.render({ isNumbered })}
					<${tag}>${headline}</${tag}>
				</inner-content>
			</section>
		`;
	}
};
