import query from "../cms.mjs";

export function getRenderer() {
	return ["inhalt_inhalt_Entry"];
}

export async function render({id, title}, {render}) {
	const content = await query(scope => `
		entry(id: ${id}) {
			 ...on inhalt_inhalt_Entry {
				${scope.content}
			 }
		}
	`);
	const children = await Promise.all(content.entry.elements.map(render));

	const heroimageCaption = (content.entry.heroimageCaption === undefined) || (content.entry.heroimageCaption === null) ? "" : `
	<figcaption>
		${content.entry.heroimageCaption}
	</figcaption>
	`;

	const heroImageUrl = (content.entry.heroimages === undefined) || (content.entry.heroimages.length === 0) ? "" : `
	<section content-type="heroimage">
		<inner-content>
			<figure figure-type="heroimage">
				<img src="${content.entry.heroimages[0].url}"/>
				${heroimageCaption}
			</figure>
		</inner-content>
	</section>`;

	return `
		${heroImageUrl}
		<section content-type="header">
			<inner-content>
				<h1>${content.entry.titleOverride || title}</h1>
			</inner-content>
		</section>
		${children.join("")}
	`;
};
