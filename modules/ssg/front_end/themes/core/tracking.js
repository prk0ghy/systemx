/* this tracks the user and posts once per pageview */
/* global configuration */

/* this generates an unique for RFC4122 v4 standart */
const generateGuid =() => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

const checkGuid = () => {
	let guid = "";
	if (localStorage.getItem("guid") !== null) {
		guid = localStorage.getItem("guid");
	}
	else {
		guid = generateGuid();
		localStorage.setItem("guid", guid);
	}
	return guid;
};

const trackClient = () => {
	const url = configuration.trackingEndpoint;
	if(!url) {return;}
	const data = {
		guid : checkGuid(),
		location : window.location.pathname,
		domain : window.location.origin
	};
	fetch(url, {
		method: "POST",
		body: JSON.stringify(data)
	}).then(res => {
		console.log("Request complete! response:", res);
	});
};

setTimeout(trackClient,0);
