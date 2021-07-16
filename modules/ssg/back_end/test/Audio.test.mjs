import cheerio from "cheerio";
import { makeMockRenderer } from "../renderer.mjs";

it("renders `inhaltsbausteine_audioDatei_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		audioFiles: [{"url":"https://test.test/audio.mp3"}],
		caption: "Testcaption",
		id: "42",
		isNumbered: true,
		posters: [{"url":"https://test.test/poster.jpg"}],
		__typename: "inhaltsbausteine_audioDatei_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("audio");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(1);
	expect($(".marker").length).toBe(1);
	expect($(".marker").text()).toBe("");
	const figure = $(`figure[figure-type="audio"]`);
	expect(figure.length).toBe(1);
	const audio = figure.find("audio");
	expect(audio.length).toBe(1);
	expect(audio.attr("controls")).toBe("controls");
	expect(audio.attr("src").length).toBeGreaterThan(4);
	expect(audio.attr("src")).toBe("https://test.test/audio.mp3");
	const poster = $(`img`);
	expect(poster.length).toBe(1);
	expect(poster.attr('src')).toBe("https://test.test/poster.jpg");
	expect(figure.html().includes("Testcaption")).toBe(true);
});
