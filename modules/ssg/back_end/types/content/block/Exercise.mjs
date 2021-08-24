export default {
	queries: new Map([
		["aufklappElemente_aufgabe_BlockType", {
			fetch: ({ types }) => `
				content: aufklappAufgabenInhalt {
					...on aufklappAufgabenInhalt_BlockType {
						elements: aufklappAufgabenElemente {
							__typename
							...on aufklappAufgabenElemente_embeddedVideoAudio_BlockType {
								${types.aufklappAufgabenElemente_embeddedVideoAudio_BlockType}
							}
							...on aufklappAufgabenElemente_galerie_BlockType {
								${types.aufklappAufgabenElemente_galerie_BlockType}
							}
							...on aufklappAufgabenElemente_h5p_BlockType {
								${types.aufklappAufgabenElemente_h5p_BlockType}
							}
							...on aufklappAufgabenElemente_textMitOhneBild_BlockType {
								${types.aufklappAufgabenElemente_textMitOhneBild_BlockType}
							}
							...on aufklappAufgabenElemente_videoDatei_BlockType {
								${types.aufklappAufgabenElemente_videoDatei_BlockType}
							}
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
							...on quersliderAufgabenElemente_galerie_BlockType {
								${types.quersliderAufgabenElemente_galerie_BlockType}
							}
							...on quersliderAufgabenElemente_h5p_BlockType {
								${types.quersliderAufgabenElemente_h5p_BlockType}
							}
							...on quersliderAufgabenElemente_tabellen_BlockType {
								${types.quersliderAufgabenElemente_tabellen_BlockType}
							}
							...on quersliderAufgabenElemente_tabulator_BlockType {
								${types.quersliderAufgabenElemente_tabulator_BlockType}
							}
							...on quersliderAufgabenElemente_textMitOhneBild_BlockType {
								${types.quersliderAufgabenElemente_textMitOhneBild_BlockType}
							}
							...on quersliderAufgabenElemente_videoDatei_BlockType {
								${types.quersliderAufgabenElemente_videoDatei_BlockType}
							}
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
							...on aufgabeElemente_audioDatei_BlockType {
								${types.aufgabeElemente_audioDatei_BlockType}
							}
							...on aufgabeElemente_embeddedVideoAudio_BlockType {
								${types.aufgabeElemente_embeddedVideoAudio_BlockType}
							}
							...on aufgabeElemente_galerie_BlockType {
								${types.aufgabeElemente_galerie_BlockType}
							}
							...on aufgabeElemente_h5p_BlockType {
								${types.aufgabeElemente_h5p_BlockType}
							}
							...on aufgabeElemente_tabulator_BlockType {
								${types.aufgabeElemente_tabulator_BlockType}
							}
							...on aufgabeElemente_tabellen_BlockType {
								${types.aufgabeElemente_tabellen_BlockType}
							}
							...on aufgabeElemente_textMitOhneBild_BlockType {
								${types.aufgabeElemente_textMitOhneBild_BlockType}
							}
							...on aufgabeElemente_videoDatei_BlockType {
								${types.aufgabeElemente_videoDatei_BlockType}
							}
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
