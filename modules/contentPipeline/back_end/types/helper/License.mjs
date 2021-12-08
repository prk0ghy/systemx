import { escapeHTML } from '../../renderingContext.mjs';

const getLicenseHref = (license,terms) => {
	if(!license){return false;}
	const ccTerms = (terms || ["BY"]).map(v => String(v).toLowerCase()).sort().join("-");
	switch(license.toUpperCase()){
	case "GFDL":
		return "https://www.gnu.org/licenses/fdl-1.3.html";
	case "CC4":
		return `https://creativecommons.org/licenses/${ccTerms}/4.0/deed.de`;
	case "CC3":
		return `https://creativecommons.org/licenses/${ccTerms}/3.0/deed.de`;
	case "CC2":
		return `https://creativecommons.org/licenses/${ccTerms}/2.0/deed.de`;
	case "CC":
		return `https://creativecommons.org/licenses/${ccTerms}/1.0/deed.de`;
	case "CC0":
		return "https://creativecommons.org/publicdomain/zero/1.0/deed.de";
	default:
		return false;
	}
};

export default {
	render({ asset }) {
		if (!asset) {
			return "";
		}
		let content = "";
		if (asset.creator) {
			if(asset.license && asset.license.toUpperCase() === "ARRC"){
				content += `<p>© ${escapeHTML(asset.creator)}</p>`;
			}else{
				content += `<p>Urheber: ${escapeHTML(asset.creator)}</p>`;
			}
		}
		if (asset.source) {
			const cooked = String(asset.source).replace(/(https?:\/\/\S+)/g,`<a href="$1">$1</a>`);
			content += `<p>${cooked}</p>`;
		}
		if (asset.license) {
			const href = getLicenseHref(asset.license,asset.creativeCommonsTerms);
			if(href){ content += `<a href="${href}">`;}
			content += `<license-info license-key="${asset.license.toUpperCase()}">`;
			content += `<license-name>${asset.license}</license-name>`;
			if (asset.creativeCommonsTerms?.length) {
				const terms    = asset.creativeCommonsTerms.sort();
				const termHTML = terms.map(v => `<license-icon icon-term="${v.toUpperCase()}">${v.toUpperCase()}</license-icon>`);
				content += termHTML.join("");
			}
			content += "</license-info>";
			if(href){ content += "</a>";}
		}
		return `
			<details class="license">
				<summary>&sect;</summary>
				<license-content>${content}</license-content>
			</details>
		`;
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
