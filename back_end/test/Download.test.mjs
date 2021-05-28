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
});
