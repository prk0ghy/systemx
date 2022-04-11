import cheerio from "cheerio";
import { makeMockRenderer } from "../renderer.mjs";
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
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("download");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(2);
	expect($("download-wrap").length).toBe(1);
	expect($("download-wrap download-text").length).toBe(1);
	expect($("download-wrap download-icon").length).toBe(1);
	expect($(".marker").length).toBe(1);
	expect($(".marker").text()).toBe("");
	expect($("download-wrap a").length).toBe(1);
	expect($("download-wrap a").attr("href")).toBe("https://example.invalid");
	expect($("download-wrap a").attr("target")).toBe("_blank");
	expect($("download-text").text().trim()).toBe("Hello, world!");
});
