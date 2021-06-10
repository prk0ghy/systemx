import { escapeHTML } from '../../RenderingContext.mjs';
export default {
	render({ asset }) {
		if (!asset) {
			return "";
		}
		let content = "";
		if (asset.creator) {
			content += `<p>Urheber: ${escapeHTML(asset.creator)}</p>`;
		}
		if (asset.source) {
			content += `<p>Quelle: <a href="${asset.source}">${asset.source}</a></p>`;
		}
		if (asset.license) {
			content += `<p>Lizenz: ${this.toName(asset.license)}</p>`;
		}
		if (asset.creativeCommonsTerms?.length) {
			content += `<p>(CC ${asset.creativeCommonsTerms.sort().join("-")})</p>`;
		}
		return `
			<details class="license">
				<summary>&sect;</summary>
				<license-content>${content}</license-content>
			</details>
		`;
	},
	toName(licenseCode) {
		if (licenseCode === "arrc") {
			return "Alle Rechte vorbehalten";
		}
		return licenseCode;
	}
};
