export default {
	queries: new Map([
		["elemente_tabulator_BlockType", {
			fetch: () => `
				__typename
			`
		}],
		["inhaltsbausteine_tabulator_BlockType", {
			fetch: () => `
				__typename
			`
		}]
	]),
	async render(_, {
		EditorialError
	}) {
		return EditorialError.render({
			message: "This element used to describe an interactive table. We have decided to re-implement such elements via h5p. Please change this element accordingly."
		});
	}
};
