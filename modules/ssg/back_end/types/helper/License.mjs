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
			content += `<license-info license-key="${asset.license.toUpperCase()}">`;
			content += `<license-name>${this.toName(asset.license)}</license-name>`;
			if (asset.creativeCommonsTerms?.length) {
				const terms    = asset.creativeCommonsTerms.sort();
				const termHTML = terms.map(v => `<license-icon icon-term="${v.toUpperCase()}">${v.toUpperCase()}</license-icon>`);
				content += termHTML.join("");
			}
			content += "</license-info>";
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
	},
	toTitle(licenseTerm) {
		switch(licenseTerm.toUpperCase()){
		case "SA":
			return "Share-Alike";
		case "BY":
			return "Attribution";
		case "ND":
			return "No-Derivatives";
		case "NC":
			return "Non-Commercial";
		default:
			return licenseTerm;
		}
	}
};
