import { make as makeMarker } from "./marker.mjs";
export default ({
	caption,
	files,
	isNumbered,
	poster
}) => {
	const src = files[0]?.url;
	return `
		<section content-type="video">
			<div class="inner-content">
				${makeMarker(isNumbered)}
				<video controls src="${src}"></video>
			</div>
		</section>
	`;
};
