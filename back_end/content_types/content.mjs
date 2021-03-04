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
					...on inhaltsbausteine_ueberschrift_BlockType {
						${scope.header}
					}
				}
			}
		}
	`);
	return (await Promise.all(content.entry.inhaltsbausteine.map(render))).join("");
}
