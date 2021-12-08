import cheerio from "cheerio";
import { makeMockRenderer } from "../renderer.mjs";

it("renders `inhaltsbausteine_tabelle_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		caption: "Le Internet",
		tableDescriptor: {
			table: "<table></table>"
		},
		id: "42",
		isNumbered: true,
		__typename: "inhaltsbausteine_tabelle_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("table");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(1);
	expect($(".marker").length).toBe(1);
	expect($("table").length).toBe(1);
	expect($("table").length).toBe(1);
	expect(html.includes("Le Internet")).toBe(true);
});
