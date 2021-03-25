export default {
	render({
		message = "There was an error rendering this content type.",
		title = "Error",
		type
	}) {
		return `
			<section content-type="error">
				<inner-content>
					<h6 class="title">${title}</h6>
					<div class="type">${type}</div>
					<p class="message">${message}</p>
				</inner-content>
			</section>
		`;
	}
};
