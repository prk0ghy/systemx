/* exported showOverlay,hideOverlay,overlayCloseHandlers */

let overlayElement;
let overlayFadeOutCBTimer;
const overlayCloseHandler = [];

function showOverlay() {
	if (overlayFadeOutCBTimer !== undefined) {
		clearTimeout(overlayFadeOutCBTimer);
	}
	overlayElement.classList.remove("fadingOut");
	overlayElement.classList.add("active");
}

function hideOverlay() {
	overlayElement.classList.add("fadingOut");
	overlayElement.classList.remove("active");
	overlayFadeOutCBTimer = setTimeout(() => {
		overlayElement.classList.remove("fadingOut");
		overlayFadeOutCBTimer = undefined;
	}, 350);
	overlayCloseHandler.forEach(cb => {
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
