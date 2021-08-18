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
		helpers: {
			Marker
		}
	}) {
		const hTag = ["h1","h2","h3","h4","h5","h6"].includes(tag) ? tag : "h3";
		const isReallyNumbered = isNumbered && tag === "h1";
		return `
			<section content-type="headline" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered: isReallyNumbered })}
					<${hTag}>${headline}</${hTag}>
				</inner-content>
			</section>
		`;
	}
};
