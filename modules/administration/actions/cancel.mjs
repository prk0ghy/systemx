import {jobs} from "../job.mjs";

const jobCancel = (data) => {
    jobs[jid].status = "stopped";
    jobs[jid].cancel = true;
    jobs[jid].progress = 100.0;
    return jobs[jid];
};

export default jobCancel;