/* exported showOverlay,hideOverlay,overlayCloseHandlers */

let overlayActive = false;
let overlayElement;
let overlayFadeOutCBTimer;
const overlayCloseHandlers = [];

function showOverlay() {
	if (overlayFadeOutCBTimer !== undefined) {
		clearTimeout(overlayFadeOutCBTimer);
	}
	overlayElement.classList.remove("fadingOut");
	overlayElement.classList.add("active");
	overlayActive = true;
}

function hideOverlay() {
	overlayElement.classList.add("fadingOut");
	overlayElement.classList.remove("active");
	overlayFadeOutCBTimer = setTimeout(() => {
		overlayElement.classList.remove("fadingOut");
		overlayFadeOutCBTimer = undefined;
	}, 350);
	overlayCloseHandlers.forEach(cb => cb());
	overlayActive = false;
}

/* Don't pollute the global scope if avoidable */
(() => {
	function initOverlay() {
		overlayElement = document.createElement("div");
		overlayElement.id = "overlay";

		const body = document.querySelector("body");
		body.appendChild(overlayElement);
		overlayElement.addEventListener("click", window.hideOverlay);

		document.addEventListener('scroll', () => {
			if(overlayActive){
				hideOverlay();
			}
		});
	}
	setTimeout(initOverlay, 0);
})();
