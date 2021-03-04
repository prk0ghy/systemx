import beautify from "js-beautify";
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
