export default {
	queries: new Map([
		["aufgabeElemente_download_BlockType", {
			fetch: ({ fragments }) => `
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				id
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
		["aufklappElemente_download_BlockType", {
			fetch: ({ fragments }) => `
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				id
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
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				id
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
		}],
		["quersliderInhalt_download_BlockType", {
			fetch: ({ fragments }) => `
				description: beschreibung
				files: datei {
					${fragments.asset}
				}
				id
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
		id,
		isNumbered,
		url
	}, {
		contentTypeIDIf,
		Error,
		download,
		helpers: {
			Marker
		}
	}) {
		const href = await download(url || file?.url);
		if (!href) {
			return Error.render({
				message: "Invalid attempt to render a download element without providing a URL or a File.",
				title: "Download URL/File missing",
				isEditorial: true
			});
		}
		return `
			<section content-type="download" ${contentTypeIDIf(id)}>
				<inner-content>
					${Marker.render({ isNumbered })}
					<download-wrap>
						<download-text>
							<p>${description}</p>
						</download-text>
						<download-icon>
							<a href="${href}" target="_blank"><p>DOWNLOAD</p></a>
						</download-icon>
					</download-wrap>
				</inner-content>
			</section>
		`;
	}
};
