/* This File should contain little helper functions to be used around the codebase */
/* exported getFirstParentSection,addHideElementContentHandler,hideElementContentHandler,openFullscreen,closeFullscreen */

function getFirstParentSection(ele){
	if(!ele){return null;}
	if(ele.tagName === 'SECTION'){return ele;}
	return getFirstParentSection(ele.parentElement);
}

const hideElementContentHandlerList = {};
function addHideElementContentHandler(name,handler){
	hideElementContentHandlerList[name] = handler;
}
function hideElementContentHandler(ele){
	for(const name in hideElementContentHandlerList){
		hideElementContentHandlerList[name](ele);
	}
}

function openFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

function closeFullscreen() {
	if( window.innerHeight !== screen.height){return;} // Already in fullscreen
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
