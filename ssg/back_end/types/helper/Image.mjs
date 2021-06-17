export default {
	async render({
		asset
	}, {
		download
	}) {
		return asset
			? `<img src="${await download(asset.url)}" width="${asset.width}" height="${asset.height}">`
			: "";
	}
};
