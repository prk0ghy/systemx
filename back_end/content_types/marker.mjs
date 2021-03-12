import cheerio from "cheerio";

export function getRenderer() {
	return [];
}

export function fill(html) {
	const $ = cheerio.load(html);
	const getNumber = index => String(index + 1);

	$(".marker").text(getNumber).attr("id", getNumber);

	return $.html();
}

export async function render({ isNumbered }) {
	return isNumbered ? String() : `<a class="marker"></a>`;
}
