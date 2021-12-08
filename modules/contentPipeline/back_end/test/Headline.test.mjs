import cheerio from "cheerio";
import { makeMockRenderer } from "../renderer.mjs";

it("renders `inhaltsbausteine_ueberschrift_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		headline: "Testerle",
		id: "42",
		tag: "h2",
		isNumbered: true,
		__typename: "inhaltsbausteine_ueberschrift_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("headline");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(1);
	expect($(".marker").length).toBe(0);
	const hEle = $("h2");
	expect(hEle.length).toBe(1);
	expect(hEle.html()).toBe("Testerle");
	const htEle = $("h1");
	expect(htEle.length).toBe(0);
});

it("renders `inhaltsbausteine_ueberschrift_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		headline: "Testerle",
		id: "42",
		tag: "h1",
		isNumbered: true,
		__typename: "inhaltsbausteine_ueberschrift_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("headline");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(1);
	expect($(".marker").length).toBe(1);
	const hEle = $("h1");
	expect(hEle.length).toBe(1);
	expect(hEle.html()).toBe("Testerle");
	const htEle = $("h2");
	expect(htEle.length).toBe(0);
});

it("renders `inhaltsbausteine_ueberschrift_BlockType`", async () => {
	const render = await makeMockRenderer();
	const html = await render({
		headline: "alert(\"You got owned!\");",
		id: "42",
		tag: "script",
		isNumbered: true,
		__typename: "inhaltsbausteine_ueberschrift_BlockType"
	});
	const $ = cheerio.load(html);
	const section = $("section");
	expect(section.length).toBe(1);
	expect(section.attr("content-type")).toBe("headline");
	expect(section.children("inner-content").length).toBe(1);
	expect(section.children().length).toBe(1);
	expect($(".marker").length).toBe(0);
	const scriptEle = $("script");
	expect(scriptEle.length).toBe(0);
});
