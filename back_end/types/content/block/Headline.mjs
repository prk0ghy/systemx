export default {
	queries: new Map([
		["elemente_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				tag: groesse
			`
		}],
		["inhalt_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				tag: groesse
			`
		}],
		["inhaltsbausteine_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				isNumbered: nummerierung
				tag: groesse
			`
		}]
	]),
	render({
		headline,
		isNumbered,
		tag = "h3"
	}, {
		EditorialError,
		helpers: {
			Marker
		}
	}) {
		const embeddedTagError = String(headline).trim().startsWith("<h")
			? EditorialError.render({
				message: "The size of this headline should be controlled via the corresponding field in the content type. However, this headline embeds the size in HTML, resulting in a faulty tree. Please remove the problematic tag."
			})
			: "";
		return `
			<section content-type="headline">
				<inner-content>
					${Marker.render({ isNumbered })}
					${embeddedTagError}
					<${tag}>${headline}</${tag}>
				</inner-content>
			</section>
		`;
	}
};
