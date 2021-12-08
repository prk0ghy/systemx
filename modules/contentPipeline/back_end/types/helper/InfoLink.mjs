export default {
	render({
		infoLink
	}) {
		return infoLink
			? `<info-link-wrap><info-link><a target="_blank" href="${infoLink}">?</a></info-link></info-link-wrap>`
			: "";
	}
};
