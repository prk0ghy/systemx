export function getRenderer() {
	return [];
}

export function fill(html) {
	let i = 0;
	return String(html).replace(/<a class="marker"><\/a>/g, () => {
		++i;
		return `<a class="marker" id="${i}">${i}</a>`;
	});
}

export async function render({ isNumbered }) {
	return isNumbered ? String() : `<a class="marker"></a>`;
}
