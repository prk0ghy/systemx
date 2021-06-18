import { request } from "graphql-request";

const requestQueue = [];
let requestsActive = 0;

function workQueue(){
	for(let i=requestsActive;i<64;i++){
		const top = requestQueue.pop();
		if(top === undefined){break;}
		requestsActive++;
		setImmediate(top);
	}
}
/*
 * We return a promise in which we create a function that
 * does the request and resolves the promise afterwards.
 * First we put it in a queue though to limit the amount of
 * requests in-flight to some value like 64 so as to not
 * overload the Server.
 */
export default (url,query) => {
	return new Promise(resolve => {
		const call = async () => {
			const result = await request(url,query);
			requestsActive--;
			workQueue();
			resolve(result);
		};
		requestQueue.push(call);
		workQueue();
	});
};