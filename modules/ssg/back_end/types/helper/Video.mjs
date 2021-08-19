export default {
	async render({
		asset,
		posterURL = null,
		controls = true,
		muted = false,
		loop = false,
		autoplay = false
	}, {
		download,
		downloadWithThumb
	}) {
		const attributes = [];
		if(posterURL){
			const {thumbHtmlPath, htmlPath} = await downloadWithThumb(posterURL);
			attributes.push(`poster="${thumbHtmlPath || htmlPath}"`);
		}
		attributes.push(controls ? "controls" : "");
		attributes.push(muted ? "muted" : "");
		attributes.push(loop ? "loop" : "");
		attributes.push(autoplay ? "autoplay" : "");
		attributes.push("playsinline"); // https://webkit.org/blog/6784/new-video-policies-for-ios/

		return asset
			? `<video ${attributes.join(" ")} src="${await download(asset.url)}"></video>`
			: "";
	}
};
