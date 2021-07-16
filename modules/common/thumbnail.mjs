import gm from "gm";

const taskQueue = [];
let tasksActive = 0;

const workQueue = () => {
	for(let i=tasksActive;i<4;i++){
		const top = taskQueue.pop();
		if(top === undefined){break;}
		tasksActive++;
		setImmediate(top);
	}
};
const thumbs = new Map();

export const getImageSize = path => {
	return new Promise((resolve, reject) => {
		const call = async () => {
			gm(path).size((err, value) => {
				tasksActive--;
				workQueue();
				if(err){
					return reject(err);
				}
				return resolve(value);
			});
		};
		taskQueue.push(call);
		workQueue();
	});
};

const makeThumbnail = (inPath, outPath, maxWidth, maxHeight) => {
	if(thumbs.has(outPath)){return thumbs.get(outPath);}
	const promise = new Promise((resolve, reject) => {
		const call = async () => {
			gm(inPath)
				.resize(maxWidth,maxHeight)
				.noProfile()
				.quality(70)
				.write(outPath, err => {
					tasksActive--;
					workQueue();
					if(err){
						return reject(err);
					}
					console.log(`✓ - ${outPath}`);
					return resolve(true);
				});
		};
		taskQueue.push(call);
		workQueue();
	});
	thumbs.set(outPath,promise);
	return promise;
};
export default makeThumbnail;
