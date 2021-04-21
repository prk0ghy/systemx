export default {
	render({
		message = "There was an error rendering this content type.",
		isEditorial,
		title = "Error",
		type
	}) {
		const editorialAttribute = isEditorial
			? "is-editorial"
			: "";
		return `
			<section content-type="error" ${editorialAttribute}>
				<inner-content>
					<h6 class="title">${title}</h6>
					<div class="type">${type}</div>
					<p class="message">${message}</p>
				</inner-content>
			</section>
		`;
	}
};
