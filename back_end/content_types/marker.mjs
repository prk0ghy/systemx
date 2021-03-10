import cheerio from "cheerio";
const className = "marker";
const getNumber = index => String(index + 1);
export const fill = html => {
	const $ = cheerio.load(html);
	$(`.${className}`)
		.text(getNumber)
		.attr("id", getNumber);
	return $.html();
};
export const make = isNumbered => isNumbered
	? String()
	: `
		<a class="${className}"></a>
	`;
