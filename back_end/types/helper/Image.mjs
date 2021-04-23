export default {
	render({
		asset
	}) {
		return asset
			? `
				<img height=${asset.height} src=${asset.url} width=${asset.width}>
			`
			: "";
	}
};
