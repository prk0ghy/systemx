import makeid from "../../common/randomString.mjs";
import { jobs } from "../job.mjs";

const asyncTimeout = (ms) => new Promise((resolve) => {
	setTimeout(() => resolve() , ms);
});

const fakeProgress = async (jid) => {
	for(let i = 0; i < 100; i++){
		await asyncTimeout(1000);
		if(jobs[jid].cancel){return;}
		jobs[jid].status = "running";
		jobs[jid].progress = i + 0.0;
	}
	jobs[jid].status = "complete";
	jobs[jid].progress = 100.0;
};

const jobDeploy = (data) => {
	const jid = makeid(64);
	if(jobs[jid]){return jobDeploy(data);}
	jobs[jid] = {...data, status: "started", id: jid, progress: 0.0};
	fakeProgress(jid);
	return jobs[jid];
};
export default jobDeploy;
