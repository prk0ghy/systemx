import jobCancel from "./actions/cancel.mjs";
import jobDeploy from "./actions/deploy.mjs";
import jobStatus from "./actions/status.mjs";

export const jobs = {};

const jobDispatch = (data) => {
	switch(data?.action){
	case "cancel":
		return jobCancel(data);
	case "deploy":
		return jobDeploy(data);
	case "status":
		return jobStatus(data);
	default:
		return {status:"error",error:"Unknown action"};
	}
};
export default jobDispatch;
