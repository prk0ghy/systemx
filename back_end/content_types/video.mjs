export default ({
	caption,
	files,
	isAutoPlay,
	isFree,
	isNumbered,
	poster
}) => {
	const src = files[0]?.url;
	return `
		<video src="${src}"></video>
	`;
};
