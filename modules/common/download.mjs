/* Simple module exporting an async function that should be used when downloading since
 * it also does rate limiting so as to not overload the client machine, which would end
 * up slowing things down.
 */
import fs from "fs";
import https from "https";

const downloadQueue = [];
let downloadsActive = 0;

const workQueue = () => {
	for(let i=downloadsActive;i<16;i++){
		const top = downloadQueue.pop();
		if(top === undefined){break;}
		downloadsActive++;
		setImmediate(top);
	}
};

const agent = new https.Agent({
	keepAlive: true,
	maxSockets: 8
});
const downloads = new Map();

const download = (url,filePath) => {
	if(!url){return null;}
	/* Assume https */
	if(url.startsWith("//")){return download(`https:${url}`,filePath);}
	/* Avoid downloading the same asset multiple times */
	if(downloads.has(url)){
		return downloads.get(url);
	}
	const promise = new Promise((resolve, reject) => {
		const call = async () => {
			try {
				const request = https.request(url, {
					agent
				}, response => {
					if (response.statusCode < 200 || response.statusCode >= 300) {
						downloadsActive--;
						workQueue();
						reject(new Error(`Bad status code - ${url} == ${response.statusCode}`));
						return;
					}
					const stream = fs.createWriteStream(filePath);
					response.pipe(stream);
					stream.on("finish", () => {
						stream.close();
						downloadsActive--;
						workQueue();
						return resolve(true);
					});
				});
				request.on("error", e => {
					console.log(`× - ${url}`);
					downloadsActive--;
					workQueue();
					reject(e);
				});
				request.end();
			} catch (error) {
				reject(error);
				return;
			}
		};
		downloadQueue.push(call);
		workQueue();
	});
	downloads.set(url, promise);
	return promise;
};
export default download;
