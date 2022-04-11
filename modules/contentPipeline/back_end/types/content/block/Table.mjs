export default {
	queries: new Map([
		["aufgabeElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle {
					table
				}
				tableType: art
			`
		}],
		["aufklappElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle {
					table
				}
				tableType: art
			`
		}],
		["inhaltsbausteine_tabelle_BlockType", {
			fetch: () => `
				caption: quelle
				id
				isNumbered: nummerierung
				tableDescriptor: tabelle {
					table
				}
				tableType: art
			`
		}],
		["quersliderAufgabenElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle_q {
					table
				}
			`
		}],
		["quersliderInhalt_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle {
					table
				}
				tableType: art
			`
		}]
	]),
	async render({
		caption,
		id,
		isNumbered,
		tableDescriptor,
		tableType = "simple-table"
	}, {
		contentTypeIDIf,
		Error,
		helpers: {
			Marker
		}
	}) {
		const tableHTML = (() => {
			if (!tableDescriptor || !tableDescriptor?.table) {
				return Error.render({
					message: "There was an attempt to parse this table, but it failed. Does the `tableDescriptor` field evaluate to `undefined`?",
					title: "Broken table"
				});
			}
			else {
				return tableDescriptor?.table;
			}
		})();
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="table" ${contentTypeIDIf(id)} table-type="${tableType}">
				${Marker.render({ isNumbered })}
				<inner-content>
					<figure figure-type="table">
						${tableHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
