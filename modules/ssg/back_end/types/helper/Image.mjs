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
		asset
	}, {
		download
	}) {
		return asset
			? `<img src="${await download(asset.url)}" width="${asset.width}" height="${asset.height}" ${getFocalPoint(asset.focalPoint)}>`
			: "";
	}
};
