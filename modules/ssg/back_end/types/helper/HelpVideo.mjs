export default {
	async render({
		asset
	}, {
		download
	}) {
		return asset
			? `
				<help-video video="${await download(asset.url)}">
					<help-video-button>?</help-video-button>
				</help-video>
			`
			: "";
	}
};
