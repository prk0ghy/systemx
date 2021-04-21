export default {
	queries: new Map([
		["inhaltsbausteine_erkundung_BlockType", {
			fetch: () => `
				__typename
			`
		}]
	]),
	async render({}, {
		EditorialError
	}) {
		return EditorialError.render({
			message: "This element used to describe an exploration. We have decided to re-implement such elements via h5p. Please change this element accordingly."
		});
	}
};
