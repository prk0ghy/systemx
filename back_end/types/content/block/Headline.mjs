export default {
	queries: new Map([
		["aufgabeElemente_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				id
				tag: groesse
			`
		}],
		["aufklappElemente_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				id
				tag: groesse
			`
		}],
		["inhaltsbausteine_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				id
				isNumbered: nummerierung
				tag: groesse
			`
		}],
		["quersliderInhalt_ueberschrift_BlockType", {
			fetch: () => `
				__typename
				headline: ueberschrift
				id
				tag: groesse
			`
		}]
	]),
	render({
		headline,
		id,
		isNumbered,
		tag = "h3"
	}, {
		contentTypeIDIf,
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
			<section content-type="headline" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					${embeddedTagError}
					<${tag}>${headline}</${tag}>
				</inner-content>
			</section>
		`;
	}
};
