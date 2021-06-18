import fs from "fs";
import path from "path";
export const mkdirp = async (...pathParts) => {
	const joinedPath = path.join(...pathParts);
	try {
		await fs.mkdirSync(joinedPath, {
			recursive: true
		});
	}
	catch (error) {
		console.error("Directory creation has failed.", error);
	}
	return joinedPath;
};
