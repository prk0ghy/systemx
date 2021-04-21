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
	async render({}, {
		Error
	}) {
		return Error.render({
			message: "This element used to describe interactive tables. We have decided to re-implement such elements via h5p.",
			title: "Editorial action needed"
		});
	}
};
