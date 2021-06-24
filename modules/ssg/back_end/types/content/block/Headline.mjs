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
				message: "A Headline should only use HTML header tags (h1 to h6), please change the content accordingly, thank you."
			})
			: "";
		const hTag = ["h1","h2","h3","h4","h5","h6"].includes(tag) ? tag : "h3";
		const isReallyNumbered = isNumbered && tag === "h1";
		return `
			<section content-type="headline" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered: isReallyNumbered })}
					${embeddedTagError}
					<${hTag}>${escapeHTML(headline)}</${hTag}>
				</inner-content>
			</section>
		`;
	}
};
