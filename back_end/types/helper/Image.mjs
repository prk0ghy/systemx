export default {
	async render({
		asset
	}, {
		download
	}) {
		return asset
			? `<img height="${asset.height}" src="${await download(asset.url)}" width="${asset.width}">`
			: "";
	}
};
