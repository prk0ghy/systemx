const getFocalPoint = focalPoint => {
	if(!focalPoint)                      {return "";}
	if(focalPoint.constructor !== Array) {return "";}
	if(focalPoint.length < 2)            {return "";}
	const fpx = focalPoint[0]*100;
	const fpy = focalPoint[1]*100;
	return `style="object-position: ${fpx|0}% ${fpy|0}%;"`;
};

export default {
	async render({
		asset,
		imageSize = 100
	}, {
		downloadWithThumb
	}) {

		const {thumbHtmlPath, thumbSize, htmlPath} = await downloadWithThumb(asset.url,imageSize);
		const thumbWidth  = thumbHtmlPath ? thumbSize?.width ? `width="${thumbSize.width}"` : "" : `width="${asset.width}`;
		const thumbHeight = thumbHtmlPath ? thumbSize?.height ? `height="${thumbSize.height}"` : "" : `height="${asset.height}`;
		return asset
			? `<img src="${thumbHtmlPath || htmlPath}" ${thumbWidth} ${thumbHeight} raw-src="${htmlPath}" raw-width="${asset.width}" raw-height="${asset.height}" ${getFocalPoint(asset.focalPoint)}>`
			: "";
	}
};
