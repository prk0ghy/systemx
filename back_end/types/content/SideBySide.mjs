export default {
	queries: new Map([
		["inhaltsbausteine_sideBySide_BlockType", {
			fetch: () => `
				__typename
			`
		}]
	]),
	async render({}, {
		EditorialError
	}) {
		return EditorialError.render({
			message: "This element used to describe a side-by-side element, for which we have dropped support."
		});
	}
};
