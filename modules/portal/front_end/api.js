const doAPICall = (() => {
	let callQueue = [];
	let idCount = 0;
	let sendCallTO;
	const promiseMap = new Map();

	const receiveResponse = async res => {
		const obj = await res.json();

		obj?.responses.forEach(res => {
			const id = res?.id | 0;
			if (!promiseMap.has(id)) {
				return;
			}
			const prom = promiseMap.get(id);
			prom.resolve(res);
		});
	};

	const sendCallQueue = () => {
		fetch("/portal-user", {
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
				requests: callQueue
			})
		}).then(receiveResponse);
		callQueue = [];
	};

	const doSingleCall = (action, v) => {
		const id = ++idCount;
		callQueue.push({
			...v,
			id,
			action
		});
		if (sendCallTO) {
			clearTimeout(sendCallTO);
		}
		sendCallTO = setTimeout(sendCallQueue, 1); // Queue up Requests for ~1ms
		return new Promise((resolve, reject) => promiseMap.set(id, {
			resolve,
			reject
		}));
	};
	return doSingleCall;
})();

export default doAPICall;
