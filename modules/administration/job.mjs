import jobCancel from "./actions/cancel.mjs";
import jobDeploy from "./actions/deploy.mjs";
import jobStatus from "./actions/status.mjs";
import releaseList from "./actions/releaseList.mjs";
import jobRestore from "./actions/restore.mjs";

export const jobs = {};

const jobDispatch = (data) => {
	switch(data?.action){
	case "cancel":
		return jobCancel(data);
	case "deploy":
		return jobDeploy(data);
	case "status":
		return jobStatus(data);
	case "releaseList":
		return releaseList(data);
	case "restore":
		return jobRestore(data);
	default:
		return {status:"error",error:"Unknown action"};
	}
};
export default jobDispatch;
