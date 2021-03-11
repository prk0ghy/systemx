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

	const heroimageCaption = (content.entry.heroimageCaption === undefined) || (content.entry.heroimageCaption === null) ? "" : `
	<figcaption>
		${content.entry.heroimageCaption}
	</figcaption>
	`;

	const heroImageUrl = (content.entry.heroimages === undefined) || (content.entry.heroimages.length === 0) ? "" : `
	<section content-type="heroimage">
		<div class="inner-content">
			<figure class="heroimage">
				<img src="${content.entry.heroimages[0].url}"/>
				${heroimageCaption}
			</figure>
		</div>
	</section>`;

	return `
		${heroImageUrl}
		<section content-type="header">
			<div class="inner-content">
				<h1 class="content-title inner-content">${content.entry.titleOverride || title}</h1>
			</div>
		</section>
		${children.join("")}
	`;
};
