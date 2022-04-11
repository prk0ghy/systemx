import cheerio from "cheerio";
import { makeMockRenderer } from "../renderer.mjs";
it("renders `inhaltsbausteine_videoDatei_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		files: [{"url":"https://test.test/video.avi"}],
		caption: "Testcaption",
		id: "42",
		isNumbered: true,
		posters: [{"url":"https://test.test/poster.jpg"}],
		__typename: "inhaltsbausteine_videoDatei_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("video");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(2);
	expect($(".marker").length).toBe(1);
	expect($(".marker").text()).toBe("");
	const figure = $(`figure[figure-type="video"]`);
	expect(figure.length).toBe(1);
	const video = figure.find("video");
	expect(video.length).toBe(1);
	expect(video.attr("controls")).toBe("controls");
	expect(video.attr("src").length).toBeGreaterThan(4);
	expect(video.attr("src")).toBe("https://test.test/video.avi");
	expect(video.attr('poster')).toBe("https://test.test/poster.jpg");
	expect(figure.html().includes("Testcaption")).toBe(true);
});
