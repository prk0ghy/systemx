export default {
	queries: new Map([
		["aufgabeElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle {
					table
				}
			`
		}],
		["aufklappElemente_tabellen_BlockType", {
			fetch: () => `
				id
				tableDescriptor: tabelle {
					table
				}
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
		console.log(tableDescriptor);
		const tableHTML = (() => {
			if(!tableDescriptor || !tableDescriptor?.table){
				return Error.render({
					message: "There was an attempt to parse this table, but it failed. Does the `tableDescriptor` field evaluate to `undefined`?",
					title: "Broken table"
				});
			}else{
				return tableDescriptor?.table;
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
