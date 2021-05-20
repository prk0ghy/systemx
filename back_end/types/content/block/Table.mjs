export default {
	queries: new Map([
		["aufgabeElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle
			`
		}],
		["aufklappElemente_tabellen_BlockType", {
			fetch: () => `
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
		}],
		["quersliderAufgabenElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle_q
			`
		}],
		["quersliderInhalt_tabellen_BlockType", {
			fetch: () => `
				id
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
		Error,
		helpers: {
			Marker
		}
	}) {
		const tableHTML = (() => {
			try {
				return JSON.parse(tableDescriptor).table;
			}
			catch {
				return Error.render({
					message: "There was an attempt to parse this table, but it failed. Does the `tableDescriptor` field evaluate to `undefined`?",
					title: "Broken table"
				});
			}
		})();
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
