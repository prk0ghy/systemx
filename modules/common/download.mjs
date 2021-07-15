import fs from "fs";
import https from "https";

const agent = new https.Agent({
	keepAlive: true,
	maxSockets: 8
});
const downloads = new Map();

const download = (url,filePath) => {
	/* Avoid downloading the same asset multiple times */
	if(downloads.has(url)){
		return downloads.get(url);
	}
	const promise = new Promise((fulfill, reject) => {
		const request = https.request(url, {
			agent
		}, response => {
			if (response.statusCode < 200 || response.statusCode >= 300) {
				reject(new Error(`Bad status code - ${url} == ${response.statusCode}`));
				return;
			}
			const stream = fs.createWriteStream(filePath);
			response.pipe(stream);
			stream.on("finish", () => {
				stream.close();
				console.log(`✓ - ${url}`);
				fulfill(true);
			});
		});
		request.on("error", reject);
		request.end();
	});
	downloads.set(url, promise);
	return promise;
};
export default download;
