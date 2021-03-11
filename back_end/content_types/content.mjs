import query from "../cms.mjs";
export default async ({
	id,
	title
}, {
	render
}) => {
	const content = await query(scope => `
		entry(id: ${id}) {
			 ...on inhalt_inhalt_Entry {
				${scope.content}
			 }
		}
	`);
	const children = await Promise.all(content.entry.elements.map(render));
	return `
		<h1 class="content-title inner-content">${content.entry.titleOverride || title}</h1>
		${children.join("")}
	`;
};
