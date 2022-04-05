import {jobs} from '../job.mjs';

const jobCancel = data => {
	const jid = data?.id;
	if ((!jid) || (!jobs[jid])) {
		return {status: 'error', error: 'Couldn\'t find specified job'};
	}

	jobs[jid].status = 'stopped';
	jobs[jid].cancel = true;
	jobs[jid].progress = 100.0;
	return jobs[jid];
};

export default jobCancel;
