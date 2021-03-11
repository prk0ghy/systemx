import makeMarker from "./marker.mjs";
export default ({
	images,
	imageWidth,
	imageBorder,
	imagePosition,
	galleryIntroductionText,
	isNumbered,
	text,
	useFlex
}) => {
	return `
		<section content-type="text-and-image">
			<div class="inner-content">
				${makeMarker(isNumbered)}
				${text}
			</div>
		</section>
	`;
};
