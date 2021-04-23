export default {
	queries: new Map([
		["elemente_tabellen_BlockType", {
			fetch: () => `
				__typename
				tableDescriptor: tabelle
			`
		}],
		["inhaltsbausteine_tabelle_BlockType", {
			fetch: () => `
				__typename
				caption: quelle
				isNumbered: nummerierung
				tableDescriptor: tabelle
			`
		}]
	]),
	async render({
		caption,
		isNumbered,
		tableDescriptor
	}, {
		helpers: {
			Marker
		}
	}) {
		const { table: tableHTML } = JSON.parse(tableDescriptor);
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="table">
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
