export default {
	queries: new Map([
		["elemente_aufgabe_BlockType", {
			fetch: ({ types }) => `
				__typename
				content: inhalt {
					...on inhalt_BlockType {
						elements: elemente_nested {
							...on elemente_nested_textMitOhneBild_BlockType {
								${types.elemente_nested_textMitOhneBild_BlockType}
							}
						}
					}
				}
				inputType: benutzereingabe
				textHTML: text
				title: titelDerAufgabe
			`
		}],
		["inhaltsbausteine_aufgabe_BlockType", {
			fetch: ({ types }) => `
				__typename
				content: inhalt {
					...on inhalt_BlockType {
						elements: elemente_nested {
							...on elemente_nested_textMitOhneBild_BlockType {
								${types.elemente_nested_textMitOhneBild_BlockType}
							}
						}
					}
				}
				html: h5p
				inputType: benutzereingabe
				isNumbered: nummerierung
				textHTML: text
				title: titelDerAufgabe
			`
		}]
	]),
	async render({
		content,
		html,
		inputType,
		isNumbered,
		textHTML,
		title
	}, {
		helpers: {
			Marker
		},
		render
	}) {
		const input = (() => {
			if (inputType === "texteingabe") {
				return `<textarea class="tasktext"></textarea>`;
			}
			return "";
		})();
		const elementsHTML = (await Promise.all((content.elements || []).map(element => render(element)))).join("");
		return `
			<section content-type="task">
				<inner-content>
					${Marker.render({ isNumbered })}
					<task-content>
						<h3>${title}</h3>
						${textHTML ?? ""}
						${elementsHTML}
						${html ?? ""}
						${input}
					</task-content>
				</inner-content>
			</section>
		`;
	}
};
