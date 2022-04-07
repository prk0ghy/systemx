import cheerio from "cheerio";
import { makeMockRenderer } from "../renderer.mjs";
it("renders `inhaltsbausteine_h5p_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		caption: "H5P Caption",
		id: "23",
		isNumbered: true,
		html: `<iframe src="https://some.random.iframe/"/>`,
		__typename: "inhaltsbausteine_h5p_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("embedding");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(2);
	expect($(".marker").length).toBe(1);
	expect($(".marker").text()).toBe("");
	const figure = $(`figure[figure-type="embedding"]`);
	expect(figure.length).toBe(1);
	const rawIframe = figure.find("iframe");
	expect(rawIframe.length).toBe(0);
	const iframe = figure.find("lazy-iframe");
	expect(iframe.length).toBe(1);
	expect(iframe.attr("src").length).toBeGreaterThan(4);
	expect(iframe.attr("src")).toBe("https://some.random.iframe/");
	expect(figure.html().includes("H5P Caption")).toBe(true);
});
