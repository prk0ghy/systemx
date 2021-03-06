import options from "../../../../common/options.mjs";
export default {
	fill(html) {
		let i = 0;
		return String(html).replace(/<a class="marker"><\/a>/g, () => {
			++i;
			return `<a class="marker" id="${i}">${i}</a>`;
		});
	},
	render({ isNumbered }, {
		hints: {
			renderMarkers = true
		}
	}) {
		return !options.disableMarkers && isNumbered && renderMarkers
			? `<a class="marker"></a>`
			: "";
	}
};
