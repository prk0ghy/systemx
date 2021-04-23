export default {
	queries: new Map([
		["inhaltsbausteine_aufgabe_BlockType", {
			fetch: () => `
				__typename
				html: h5p
				inputType: benutzereingabe
				isNumbered: nummerierung
				textHTML: text
				title: titelDerAufgabe
			`
		}]
	]),
	async render({
		html,
		inputType,
		isNumbered,
		textHTML,
		title
	}, {
		helpers: {
			Marker
		}
	}) {
		const input = (() => {
			if (inputType === "texteingabe") {
				return `<textarea class="tasktext"></textarea>`;
			}
			return null;
		})();
		return `
			<section content-type="task">
				<inner-content>
					${Marker.render({ isNumbered })}
					<task-content>
						<h3>${title}</h3>
						${textHTML ?? ""}
						${html ?? ""}
						${input ?? ""}
					</task-content>
				</inner-content>
			</section>
		`;
	}
};
