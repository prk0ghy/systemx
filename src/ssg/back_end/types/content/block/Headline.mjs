export default {
	queries: new Map([
		["aufgabeElemente_ueberschrift_BlockType", {
			fetch: () => `
				headline: ueberschrift
				id
				tag: groesse
			`
		}],
		["aufklappElemente_ueberschrift_BlockType", {
			fetch: () => `
				headline: ueberschrift
				id
				tag: groesse
			`
		}],
		["inhaltsbausteine_ueberschrift_BlockType", {
			fetch: () => `
				headline: ueberschrift
				id
				isNumbered: nummerierung
				tag: groesse
			`
		}],
		["quersliderInhalt_ueberschrift_BlockType", {
			fetch: () => `
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
		escapeHTML,
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
		const isReallyNumbered = isNumbered && tag === "h1";
		return `
			<section content-type="headline" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered: isReallyNumbered })}
					${embeddedTagError}
					<${tag}>${escapeHTML(headline)}</${tag}>
				</inner-content>
			</section>
		`;
	}
};