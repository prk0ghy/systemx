import beautify from "js-beautify";

export const formatBytes = bytes => {
	const prefixes = ["Ki", "Mi", "Gi", "Ti"];
	const [amount = bytes, prefix = ""] = (() => {
		for (let i = prefixes.length - 1; i >= 0; --i) {
			const bytesInPrefix = 2 ** (10 * (i + 1));
			const amount = bytes / bytesInPrefix;
			if (amount >= 1) {
				return [amount.toFixed(2), prefixes[i]];

			}
		}
		return [];
	})();
	return `${amount}\u202f${prefix}B`;
};

export const formatHTML = html => beautify.html(html, {
	indent_size: "1",
	indent_char: "\t",
	max_preserve_newlines: "-1",
	preserve_newlines: false,
	keep_array_indentation: true,
	break_chained_methods: false,
	indent_scripts: "normal",
	brace_style: "collapse",
	space_before_conditional: true,
	unescape_strings: false,
	jslint_happy: true,
	end_with_newline: false,
	wrap_line_length: "0",
	indent_inner_html: true,
	comma_first: false,
	e4x: false,
	indent_empty_lines: false
});

export const formatPrice = price => !price
	? ""
	: `€ ${price.toFixed(2)}\u{202f}`.replace(".", ",");
