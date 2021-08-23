export default {
	queries: new Map([
		["aufgabeElemente_h5p_BlockType", {
			fetch: () => `
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["aufklappAufgabenElemente_h5p_BlockType", {
			fetch: () => `
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["aufklappElemente_h5p_BlockType", {
			fetch: () => `
				caption: unterschrift_nested
				html: h5p_slider
				id
			`
		}],
		["inhaltsbausteine_h5p_BlockType", {
			fetch: ({ fragments }) => `
				caption: unterschrift_h5p
				helpVideos: hilfsvideo {
					${fragments.asset}
				}
				html: h5p
				id
				isNumbered: nummerierung
			`,
			map: ({
				helpVideos,
				...rest
			}) => ({
				helpVideo: helpVideos[0],
				...rest
			})
		}],
		["quersliderAufgabenElemente_h5p_BlockType", {
			fetch: () => `
				html: h5p_embed
				id
			`
		}],
		["quersliderInhalt_h5p_BlockType", {
			fetch: () => `
				caption: unterschrift
				html: h5p_slider
				id
			`
		}]
	]),
	async render({
		caption,
		helpVideo,
		id,
		isNumbered,
		html
	}, {
		contentTypeIDIf,
		EditorialError,
		helpers: {
			HelpVideo,
			Marker
		}
	}) {
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		const embeddingHTML = html || EditorialError.render({
			message: "This embedding is missing the required embedding HTML."
		});
		return `
			<section content-type="embedding" ${contentTypeIDIf(id)} embedding-type="h5p">
				<inner-content>
					${Marker.render({ isNumbered })}
					${await HelpVideo.render({ asset: helpVideo })}
					<figure figure-type="embedding">
						${embeddingHTML.replace("http://","https://").replace("<iframe ","<lazy-iframe ")}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
