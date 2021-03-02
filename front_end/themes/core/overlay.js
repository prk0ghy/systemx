/* global showOverlay,hideOverlay,overlayCloseHandlers */

let overlayElement;
let overlayFadeOutCB;
const overlayCloseHandler = [];

function showOverlay() {
	if (overlayFadeOutCB !== undefined) {
		clearTimeout(overlayFadeOutCB);
	}
	overlayElement.classList.remove("fadingOut");
	overlayElement.classList.add("active");
}

function hideOverlay() {
	overlayElement.classList.add("fadingOut");
	overlayElement.classList.remove("active");
	overlayFadeOutCB = setTimeout(() => {
		overlayElement.classList.remove("fadingOut");
		overlayFadeOutCB = undefined;
	}, 350);
	overlayCloseHandlers.forEach(cb => {
		cb();
	});
}

/* Don't pollute the global scope if avoidable */
(() => {
	function initOverlay() {
		overlayElement = document.createElement("div");
		overlayElement.id = "overlay";

		const body = document.querySelector("body");
		body.appendChild(overlayElement);
		overlayElement.addEventListener("click", window.hideOverlay);
	}
	setTimeout(initOverlay, 0);
})();
