/* exported canUseEmbeds,allowUseOfEmbeds,embedsAllowed,continueWhenAllowed */
/* global hideOverlay,showModal */

const allowUseOfEmbeds = async (v) => {
	if(v){
		localStorage.setItem('allowExternalEmbeds', 'true');
		continuationsWaitingForAllowedEmbeds.forEach(c => c());
	}else {
		localStorage.removeItem('allowExternalEmbeds');
	}
};

const embedsAllowed = () => localStorage.getItem('allowExternalEmbeds') === 'true';

const continuationsWaitingForAllowedEmbeds = [];
const continueWhenAllowed = () => new Promise(resolve => {
	continuationsWaitingForAllowedEmbeds.push(resolve);
});

const canUseEmbeds = () => new Promise(resolve => {
	if(embedsAllowed()){ resolve(true); return; }
	hideOverlay();

	const modal = showModal(`<p>An dieser Stelle finden Sie einen externen Inhalt. Wenn Sie solche Inhalte freischalten, können personenbezogene Daten an Drittplattformen übermittelt werden. </p>
		<p>Mehr dazu in unserer <a href="./datenschutz/" target="_blank">Datenschutzerklaerung</a>.</p>
		<div id="privacy-btn-wrap">
		<button button-type="accept">Akzeptieren</button>
		<button button-type="cancel">Abbrechen</button>
		</div>`);
	const cancelButton = modal.querySelector(`button[button-type="cancel"]`);
	cancelButton.addEventListener("click", () => {
		hideOverlay();
		return resolve(false);
	});
	const acceptButton = modal.querySelector(`button[button-type="accept"]`);
	acceptButton.addEventListener("click", async () => {
		await allowUseOfEmbeds(true);
		hideOverlay();
		return resolve(true);
	});
	acceptButton.focus();
});
