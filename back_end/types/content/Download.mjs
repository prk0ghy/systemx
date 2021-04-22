export default {
	queries: new Map([
		["elemente_download_BlockType", {
			fetch: ({ fragments }) => `
				__typename
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				url: urldownload
			`,
			map: ({
				files,
				...rest
			}) => ({
				file: files[0],
				...rest
			})
		}],
		["inhalt_download_BlockType", {
			fetch: ({ fragments }) => `
				__typename
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				url: urldownload
			`,
			map: ({
				files,
				...rest
			}) => ({
				file: files[0],
				...rest
			})
		}],
		["inhaltsbausteine_download_BlockType", {
			fetch: ({ fragments }) => `
				__typename
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				isNumbered: nummerierung
				url: urldownload
			`,
			map: ({
				files,
				...rest
			}) => ({
				file: files[0],
				...rest
			})
		}]
	]),
	async render({
		description,
		file,
		isNumbered,
		url
	}, {
		helpers: {
			Marker
		}
	}) {
		return `
			<section content-type="download">
				<inner-content>
					${Marker.render({ isNumbered })}
					<download-wrap>
						<download-text>
							<p>${description}</p>
						</download-text>
						<download-icon>
							<a href="${url || file.url}" target="blank">
								<p>DOWNLOAD</p>
							</a>
						</download-icon>
					</download-wrap>
				</inner-content>
			</section>
		`;
	}
};
