/* exported showOverlay,hideOverlay,overlayCloseHandlers */

let oldScrollTop = 0;
let overlayElement;
let overlayFadeOutCBTimer;
const overlayCloseHandlers = [];

function showOverlay() {
	if (overlayFadeOutCBTimer !== undefined) {
		clearTimeout(overlayFadeOutCBTimer);
	}
	overlayElement.classList.remove("fadingOut");
	overlayElement.classList.add("active");
	oldScrollTop = document.documentElement.scrollTop;
	document.body.style.top = (-oldScrollTop)+"px";
	document.body.classList.add("modal-active");
}

function hideOverlay() {
	overlayElement.classList.add("fadingOut");
	overlayElement.classList.remove("active");
	overlayFadeOutCBTimer = setTimeout(() => {
		overlayElement.classList.remove("fadingOut");
		overlayFadeOutCBTimer = undefined;
	}, 350);
	overlayCloseHandlers.forEach(cb => cb());
	document.body.classList.remove("modal-active");
	document.documentElement.scrollTop = oldScrollTop;
	document.body.style.top = undefined;
}

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
