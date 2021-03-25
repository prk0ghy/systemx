export default {
	render({
		asset
	}) {
		return `
			<img height=${asset.height} src=${asset.url} width=${asset.width}>
		`;
	}
};
