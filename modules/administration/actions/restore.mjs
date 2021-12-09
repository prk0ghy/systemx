import fs from "fs";
import path from "path";
import options from "../../common/options.mjs";
const fsp = fs.promises;


const jobRestore = async (data) => {
	const release = data.release;
	if (!release) { return {status:"error",error:"Couldn't find Release"};}
	const absoluteRelease = path.join( options.deploymentDirectory, release);
	const stats = await fsp.stat(absoluteRelease);
	if (!stats.isDirectory) {
		return {status:"error",error:"Couldn't find Release"};
	}

	try {
		await fsp.unlink(path.join(options.deploymentDirectory, "previous"));
	}
	catch(error) {
		console.error(error);
	}

	try {
		await fsp.rename(path.join(options.deploymentDirectory, "current"), path.join(options.deploymentDirectory, "previous"));

	}
	catch(error) {
		console.error(error);
	}

	try {
		await fsp.symlink(absoluteRelease, path.join(options.deploymentDirectory, "current"));
	}
	catch(error) {
		console.error(error);
	}

	return { status: "complete", release };
};
export default jobRestore;
