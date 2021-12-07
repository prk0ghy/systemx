import jobDeploy from "./actions/deploy.mjs";
import jobStatus from "./actions/status.mjs";

export const jobs = {};

const jobDispatch = (data) => {
    switch(data?.action){
        case "deploy":
            return jobDeploy(data);
        case "status":
            return jobStatus(data);
    }
};
export default jobDispatch;
