export default {
	queries: new Map([
		["elemente_tabellen_BlockType", {
			fetch: () => `
				__typename
				id
				tableDescriptor: tabelle
			`
		}],
		["inhalt_tabellen_BlockType", {
			fetch: () => `
				__typename
				caption: quelle
				id
				tableDescriptor: tabelle
			`
		}],
		["inhaltsbausteine_tabelle_BlockType", {
			fetch: () => `
				__typename
				caption: quelle
				id
				isNumbered: nummerierung
				tableDescriptor: tabelle
			`
		}]
	]),
	async render({
		caption,
		id,
		isNumbered,
		tableDescriptor
	}, {
		contentTypeIDIf,
		helpers: {
			Marker
		}
	}) {
		const { table: tableHTML } = JSON.parse(tableDescriptor);
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="table" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					<figure figure-type="table">
						${tableHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
