export default ({
	headline,
	isNumbered
}) => {
	return `
		<section content-type="header">
			<div class="inner-content">
				<h3>${headline}</h3>
			</div>
		</section>
	`;
};
