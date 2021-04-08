export function getRenderer() {
	return ["inhaltsbausteine_ueberschrift_BlockType"];
}

export async function render({headline, isNumbered}) {
	isNumbered; // NOP so eslint won't complain, remove ASAP
	return `
		<section content-type="header">
			<inner-content>
				<h3>${headline}</h3>
			</inner-content>
		</section>
	`;
};
