export default {
	queries: new Map([
		["aufklappElemente_aufgabe_BlockType", {
			fetch: ({ types }) => `
				content: aufklappAufgabenInhalt {
					...on aufklappAufgabenInhalt_BlockType {
						elements: aufklappAufgabenElemente {
							__typename
							${Object.keys(types).filter(k => k.startsWith("aufklappAufgabenElemente_")).map(k => `... on ${k} { ${types[k]} }`)}
						}
					}
				}
				id
				inputType: benutzereingabe
				textHTML: text
				title: titelDerAufgabe
			`,
			map: ({
				content,
				...rest
			}) => ({
				...rest,
				content: content[0]
			})
		}],
		["quersliderInhalt_aufgabe_BlockType", {
			fetch: ({ types }) => `
				content: quersliderAufgabenInhalt {
					...on quersliderAufgabenInhalt_BlockType {
						elements: quersliderAufgabenElemente {
							__typename
							${Object.keys(types).filter(k => k.startsWith("quersliderAufgabenElemente_")).map(k => `... on ${k} { ${types[k]} }`)}
						}
					}
				}
				id
				inputType: benutzereingabe
				textHTML: text
				title: titelDerAufgabe
			`,
			map: ({
				content,
				...rest
			}) => ({
				...rest,
				content: content[0]
			})
		}],
		["inhaltsbausteine_aufgabe_BlockType", {
			fetch: ({
				fragments,
				types
			}) => `
				content: aufgabeInhalt {
					...on aufgabeInhalt_BlockType {
						elements: aufgabeElemente {
							__typename
							${Object.keys(types).filter(k => k.startsWith("aufgabeElemente_")).map(k => `... on ${k} { ${types[k]} }`)}
						}
					}
				}
				helpVideos: hilfsvideo_q {
					${fragments.asset}
				}
				html: h5p
				id
				inputType: benutzereingabe
				isNumbered: nummerierung
				textHTML: text
				title: titelDerAufgabe
			`,
			map: ({
				content,
				helpVideos,
				...rest
			}) => ({
				...rest,
				content: content[0],
				helpVideo: helpVideos[0]
			})
		}]
	]),
	async render({
		content,
		helpVideo,
		html,
		id,
		inputType,
		isNumbered,
		textHTML,
		title
	}, {
		contentTypeIDIf,
		CleanEmbeddingHTML,
		helpers: {
			HelpVideo,
			Marker
		},
		render
	}) {
		const titleHTML = title
			? `<h3>${title}</h3>`
			: "";
		const input = (() => {
			switch(inputType){
			default:
				return "";
			case "dateiupload":
				return `<exercise-files></exercise-files>`;
			case "texteingabe":
				return `<textarea class="exercise-text"></textarea>`;
			}
		})();
		const elementsHTML = (await Promise.all((content.elements || []).map(element => render(element)))).join("");
		return `
			<section content-type="exercise" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					${await HelpVideo.render({ asset: helpVideo })}
					<exercise-content>
						${titleHTML}
						${textHTML ?? ""}
						${elementsHTML}
						${CleanEmbeddingHTML(html ?? "")}
						${input}
					</exercise-content>
				</inner-content>
			</section>
		`;
	}
};
