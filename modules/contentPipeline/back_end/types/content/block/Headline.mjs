export default {
	queries: new Map([
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
				infoLink
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
		infoLink = "",
		tag = "h3"
	}, {
		contentTypeIDIf,
		helpers: {
			InfoLink,
			Marker
		}
	}) {
		const hTag = ["h1","h2","h3","h4","h5","h6"].includes(tag) ? tag : "h3";
		const isReallyNumbered = isNumbered && tag === "h1";
		return `
			<section content-type="headline" ${contentTypeIDIf(id)}>
				${Marker.render({ isNumbered: isReallyNumbered })}
				${InfoLink.render({infoLink}) }
				<inner-content>
					<${hTag}>${headline}</${hTag}>
				</inner-content>
			</section>
		`;
	}
};
