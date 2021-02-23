let overlayElement;
let overlayCloseHandler = [];

function showOverlay(){
	overlayElement.classList.add('active');
}

function hideOverlay(){
	overlayElement.classList.remove('active');
	overlayCloseHandler.forEach( (cb) => { cb(); });
}

function initOverlay(){
	overlayElement = document.createElement("div");
	overlayElement.id = "overlay";

	const body = document.querySelector('body');
	body.appendChild(overlayElement);
	overlayElement.addEventListener('click',(e) => {
		hideOverlay();
	});
}
setTimeout(initOverlay,0);