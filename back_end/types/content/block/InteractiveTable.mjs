export default {
	queries: new Map([
		["aufgabeElemente_tabulator_BlockType", {
			fetch: () => `
				id
			`
		}],
		["aufklappElemente_tabulator_BlockType", {
			fetch: () => `
				id
			`
		}],
		["inhaltsbausteine_tabulator_BlockType", {
			fetch: () => `
				__typename
				id
			`
		}],
		["quersliderAufgabenElemente_tabulator_BlockType", {
			fetch: () => `
				id
			`
		}],
		["quersliderInhalt_tabulator_BlockType", {
			fetch: () => `
				id
			`
		}]
	]),
	async render({
		id
	}, {
		EditorialError
	}) {
		return EditorialError.render({
			message: `This element used to describe this interactive table (id = ${id}). We have decided to re-implement such elements via h5p. Please change this element accordingly.`
		});
	}
};
