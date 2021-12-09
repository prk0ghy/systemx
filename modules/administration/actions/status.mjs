import {jobs} from "../job.mjs";

const jobStatus = (data) => {
	const jid = data?.id;
	if((!jid) || (!jobs[jid])){
		return {status:"error",error:"Couldn't find specified job"};
	}
	return jobs[jid];
};
export default jobStatus;
