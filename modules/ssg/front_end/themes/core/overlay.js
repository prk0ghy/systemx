/* exported showOverlay,hideOverlay,overlayCloseHandlers */

// We have to preserve the old scrollTop because we disable scrolling
// while an overlay is acive.
let oldScrollTop = 0;
let overlayElement = null;
let overlayActive = false;
const overlayCloseHandlers = [];

const showOverlay = (blurException) => {
	overlayElement.setAttribute("open","open");
	overlayElement.classList.add("active");

	if(!overlayActive){
		oldScrollTop = document.documentElement.scrollTop|0;
		document.body.style.top = (-oldScrollTop)+"px";
	}
	overlayActive = true;
	// This needs to be last, because as soon as we add this class scrolling is disabled, setting scrollTop to 0
	document.body.classList.add("modal-active");

	for(const child of document.querySelector("main").children){
		if(child === blurException){
			child.classList.remove("overlay-blur");
		}else{
			child.classList.add("overlay-blur");
		}
	}
};

const hideOverlay = () => {
	if(!overlayActive){return;}
	overlayElement.removeAttribute("open");
	for(const cb of overlayCloseHandlers){cb();}

	for(const child of document.querySelector("main").children){
		child.classList.remove("overlay-blur");
	}

	// Now it needs to be first, because otherwise there is nowhere to scroll to
	document.body.classList.remove("modal-active");
	document.documentElement.scrollTop = oldScrollTop;
	document.body.style.top = "";
	overlayActive = false;
};

(() => {
	const initOverlay = () => {
		overlayElement = document.createElement("PAGE-OVERLAY");

		document.body.appendChild(overlayElement);
		overlayElement.addEventListener("click", hideOverlay);
		// This is important so we can set scrollTop before leaving the site
		// because most browsers save the scrollTop position and restore it when using the history
		addEventListener("beforeunload",hideOverlay);

		// active class should be removed last, since it sets the z-index
		overlayElement.addEventListener("transitionend",e => {
			if(e.propertyName !== 'opacity')                 {return;}
			if(overlayElement.getAttribute("open") !== null) {return;}
			overlayElement.classList.remove("active");
		});
	};
	setTimeout(initOverlay, 0);
})();
