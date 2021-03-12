import * as marker from "./marker.mjs";

export function getRenderer() {
	return ["inhaltsbausteine_textMitOhneBild_BlockType"];
}

export async function render({
	images,
	imageWidth,
	imageBorder,
	imagePosition,
	galleryIntroductionText,
	isNumbered,
	text,
	useFlex
}) {
	images; // NOP so eslint won't complain, remove ASAP
	imageWidth; // NOP so eslint won't complain, remove ASAP
	imageBorder; // NOP so eslint won't complain, remove ASAP
	imagePosition; // NOP so eslint won't complain, remove ASAP
	galleryIntroductionText; // NOP so eslint won't complain, remove ASAP
	useFlex; // NOP so eslint won't complain, remove ASAP

	return `
		<section content-type="text-and-image">
			<div class="inner-content">
				${await marker.render(isNumbered)}
				${text}
			</div>
		</section>
	`;
}
