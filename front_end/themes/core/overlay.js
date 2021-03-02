/* exported showOverlay,hideOverlay */

let overlayElement;
let overlayFadeOutCB;
let overlayCloseHandler = [];

function showOverlay(){
	if(overlayFadeOutCB !== undefined){
		clearTimeout(overlayFadeOutCB);
	}
	overlayElement.classList.remove('fadingOut');
	overlayElement.classList.add('active');
}

function hideOverlay(){
	overlayElement.classList.add('fadingOut');
	overlayElement.classList.remove('active');
	overlayFadeOutCB = setTimeout(()=>{
		overlayElement.classList.remove('fadingOut');
		overlayFadeOutCB = undefined;
	},350)
	overlayCloseHandler.forEach( (cb) => { cb(); });
}

function initOverlay(){
	overlayElement = document.createElement("div");
	overlayElement.id = "overlay";

	const body = document.querySelector('body');
	body.appendChild(overlayElement);
	overlayElement.addEventListener('click',() => {
		hideOverlay();
	});
}
setTimeout(initOverlay,0);
