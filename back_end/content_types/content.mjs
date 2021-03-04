import query from "../cms.mjs";
export default async ({
	id,
	title
}, render) => {
	const content = await query(scope => `
		entry(id: ${id}) {
			 ...on inhalt_inhalt_Entry {
				inhaltsbausteine {
					__typename
					...on inhaltsbausteine_videoDatei_BlockType {
						${scope.video}
					}
				}
			}
		}
	`);
	return content.entry.inhaltsbausteine.map(render).join("");
}
