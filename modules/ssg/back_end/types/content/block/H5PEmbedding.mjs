export default {
	queries: new Map([
		["aufgabeElemente_h5p_BlockType", {
			fetch: () => `
				author: urheber
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["aufklappAufgabenElemente_h5p_BlockType", {
			fetch: () => `
				author: urheber
				caption: unterschrift
				html: h5p
				id
			`
		}],
		["aufklappElemente_h5p_BlockType", {
			fetch: () => `
				author: urheber_nested
				caption: unterschrift_nested
				html: h5p_slider
				id
			`
		}],
		["inhaltsbausteine_h5p_BlockType", {
			fetch: ({ fragments }) => `
				author: urheber_h5p
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
				author: urheber_embed
				caption: unterschrift_embed
				html: h5p_embed
				id
			`
		}],
		["quersliderInhalt_h5p_BlockType", {
			fetch: () => `
				author: urheber_slider
				caption: unterschrift
				html: h5p_slider
				id
			`
		}]
	]),
	async render({
		author,
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
		const authorHTML = author
			? `<details class="license">
				<summary>&sect;</summary>
				<license-content>${author}</license-content>
			   </details>`
			: "";
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		const rawEmbeddingHTML = html || EditorialError.render({
			message: "This embedding is missing the required embedding HTML."
		});
		const embeddingHTML = rawEmbeddingHTML
			.replace("http://","https://")
			.replace("<iframe ","<lazy-iframe ")
			.replace("</iframe>","</lazy-iframe>");
		return `
			<section content-type="embedding" ${contentTypeIDIf(id)} embedding-type="h5p">
				<inner-content>
					${Marker.render({ isNumbered })}
					${await HelpVideo.render({ asset: helpVideo })}
					<figure figure-type="embedding">
						${embeddingHTML}
						${authorHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
