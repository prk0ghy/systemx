export default {
	async render({
		asset,
		posterURL = null,
		controls = true,
		muted = false,
		loop = false,
		autoplay = false
	}, {
		download
	}) {
		const attributes = [];
		attributes.push(posterURL !== null ? `poster="${posterURL}"` : "");
		attributes.push(controls ? "controls" : "");
		attributes.push(muted ? "muted" : "");
		attributes.push(loop ? "loop" : "");
		attributes.push(autoplay ? "autoplay" : "");

		return asset
			? `<video ${attributes.join(" ")} src="${await download(asset.url)}"></video>`
			: "";
	}
};
