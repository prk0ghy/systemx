/* exported showOverlay,hideOverlay,overlayCloseHandlers */

let oldScrollTop = 0;
let overlayElement;
const overlayCloseHandlers = [];

function showOverlay() {
	overlayElement.setAttribute("open","open");
	overlayElement.classList.add("active");
	oldScrollTop = document.documentElement.scrollTop|0;
	document.body.style.top = (-oldScrollTop)+"px";
	document.body.classList.add("modal-active");
}

function hideOverlay() {
	overlayElement.removeAttribute("open","open");
	overlayCloseHandlers.forEach(cb => cb());
	document.body.classList.remove("modal-active");
	document.documentElement.scrollTop = oldScrollTop;
	document.body.style.top = undefined;
}

(() => {
	function initOverlay() {
		overlayElement = document.createElement("PAGE-OVERLAY");

		const body = document.querySelector("body");
		body.appendChild(overlayElement);
		overlayElement.addEventListener("click", window.hideOverlay);
		// This is important so we can set scrollTop before leaving the site
		// because most browsers save the scrollTop position and restore it when using the history
		addEventListener("beforeunload",hideOverlay);

		overlayElement.addEventListener("transitionend",(e) => {
			if(e.propertyName !== 'opacity')                 {return;}
			if(overlayElement.getAttribute("open") !== null) {return;}
			overlayElement.classList.remove("active");
		});
	}
	setTimeout(initOverlay, 0);
})();
