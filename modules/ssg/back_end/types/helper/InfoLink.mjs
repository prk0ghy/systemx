export default {
	render({
		infoLink
	}) {
		return infoLink
			? `<info-link><a target="_blank" href="${infoLink}">?</a></info-link>`
			: "";
	}
};
