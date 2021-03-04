export default ({
	caption,
	files,
	isAutoPlay,
	isFree,
	isNumbered,
	poster
}) => {
	const src = files[0]?.url;
	return `<section content-type="video"><div class="inner-content">
		<video controls src="${src}"></video>
	</div></section>
	`;
};
