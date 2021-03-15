import * as marker from "./marker.mjs";

export function getRenderer() {
	return ["inhaltsbausteine_videoDatei_BlockType"];
}

export async function render({caption, files, isNumbered, poster}) {
	caption; // NOP so eslint won't complain, remove ASAP
	poster; // NOP so eslint won't complain, remove ASAP

	const src = files[0]?.url;
	return `
		<section content-type="video">
			<div class="inner-content">
				${await marker.render(isNumbered)}
				<video controls src="${src}"></video>
			</div>
		</section>
	`;
};
