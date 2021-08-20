const id = "shop";
const version = 1;
const persistence = (() => {
	const initialValue = {
		contexts: {},
		version
	};
	try {
		const parsed = JSON.parse(localStorage[id]);
		if (parsed.version !== version) {
			localStorage[id] = JSON.stringify(initialValue);
			return initialValue;
		}
		return parsed;
	}
	catch {
		return initialValue;
	}
})();
export default persistence;
export const save = callback => {
	callback(persistence);
	localStorage[id] = JSON.stringify(persistence);
};
