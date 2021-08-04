/* exported canUseEmbeds,allowUseOfEmbeds */
/* global hideOverlay,showModal */

const allowUseOfEmbeds = async (v) => {
	if(v){
		localStorage.setItem('allowExternalEmbeds', 'true');
	}else {
		localStorage.removeItem('allowExternalEmbeds');
	}
};

const canUseEmbeds = () => new Promise(resolve => {
	if(localStorage.getItem('allowExternalEmbeds') === 'true'){ resolve(true); return; }

	const modal = showModal(`<p>Fuer externe Embeds, benoetigen wir Ihre Zustimmung, eine Verbindung zu dem jeweiligem Anbieter aufzubauen</p>
		<p>In unserer <a href="./datenschutz/" target="_blank">Datenschutzerklaerung</a> koennen Sie mehr dazu erfahren</p>

		<button button-type="accept">Akzeptieren</button>
		<button button-type="cancel">Abbrechen</button>`);

	modal.querySelector(`button[button-type="accept"]`).addEventListener("click", async () => {
		await allowUseOfEmbeds(true);
		hideOverlay();
		return resolve(true);
	});
	modal.querySelector(`button[button-type="cancel"]`).addEventListener("click", () => {
		hideOverlay();
		return resolve(false);
	});
});
