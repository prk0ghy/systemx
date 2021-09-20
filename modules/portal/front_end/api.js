import { useAuthentication } from "contexts/Authentication";
import { useMemo } from "react";
/* Those are hardcoded for now, would be much nicer
 * to define these in a config file though.
 */
const portalAPIEndpoint = "http://localhost:8020/portal-user";
const localStorageID = "Portal_Session_Token";

let sessionID = null;
let callQueue = [];
let idCount = 0;
let sendCallTO;
const promiseMap = new Map();

if (typeof localStorage !== "undefined") {
	sessionID = localStorage[localStorageID];
}

/* Gets called when we received new data from the server, which
 * this routine then proceeds to map to their respective promise
 * which then gets resolved, resuming the original callers continuation.
 *
 * Also persists a sessionID from a successful login, necessiated by many
 * browsers now blocking Third-Party Cookies by default and it being a
 * much nicer Development Setup to have separate FE/BE Instances running.
 */
const receiveResponse = async res => {
	const obj = await res.json();

	obj?.responses.forEach(res => {
		const id = res?.id | 0;
		if (res?.login && res?.sessionID) {
			sessionID = res.sessionID;
			localStorage[localStorageID] = sessionID;
		}
		if (!promiseMap.has(id)) {
			return;
		}
		const prom = promiseMap.get(id);
		prom.resolve(res);
	});
};
/* Send off the whole call queue and empty it afterwards. */
const sendCallQueue = () => {
	fetch(portalAPIEndpoint, {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json"
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
		body: JSON.stringify({
			sessionID,
			requests: callQueue
		})
	}).then(receiveResponse);
	callQueue = [];
};

const doAPICall = (action, v) => {
	const id = ++idCount;
	callQueue.push({
		...v,
		id,
		action
	});
	/* Queue up calls for ~1ms in order to reduce the overhead of doing a HTTP(S) request,
	 * in order to simplify the API by enabling us to use many small and specific RPCs, instead
	 * of manually bundling separate things together.
	 */
	if (sendCallTO) {
		clearTimeout(sendCallTO);
	}
	sendCallTO = setTimeout(sendCallQueue, 1);
	/* Finally return a new promise that gets stored in the promiseMap, hopefully to be resolved
	 * at a later time.
	 */
	return new Promise((resolve, reject) => promiseMap.set(id, { resolve, reject }));
};

export const userLogin = (username, password) => doAPICall("login", { username, password });
export const userLogout = () => doAPICall("logout", {});
export const userGetInfo = () => doAPICall("userinfo", {});

export default doAPICall;

export const useRefreshUserData = () => {
	const [, dispatch] = useAuthentication();
	return useMemo(() => {
		return [async () => {
			const userData = await userGetInfo();
			dispatch({ type: "SET_USER_DATA", data: { user: userData?.user } });
		}];
	}, [dispatch]);
};