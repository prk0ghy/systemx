import { makeMockRenderer } from "../renderer.mjs";
import cheerio from "cheerio";
it("renders `inhaltsbausteine_download_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		description: "Hello, world!",
		file: null,
		id: "42",
		isNumbered: true,
		url: "https://example.invalid",
		__typename: "inhaltsbausteine_download_BlockType"
	});
	expect(html.includes("Hello, world")).toBe(true);
	const dom = cheerio.load(html);
	const section = dom("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("download");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(1);
	expect(dom("download-wrap").length).toBe(1);
	expect(dom("download-wrap download-text").length).toBe(1);
	expect(dom("download-wrap download-icon").length).toBe(1);
	expect(dom(".marker").length).toBe(1);
	expect(dom(".marker").text()).toBe("");
	expect(dom("download-wrap a").length).toBe(1);
	expect(dom("download-wrap a").attr("href")).toBe("https://example.invalid");
	expect(dom("download-wrap a").attr("target")).toBe("_blank");
	expect(dom("download-text").text().trim()).toBe("Hello, world!");
});
