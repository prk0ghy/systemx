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

/* Important to do this here and not in the closeFullscreen
 * procedure because a user might exit fullscreen mode by
 * pressing ESC or something similar.
 */
document.addEventListener("fullscreenchange", () => {
	if( window.innerHeight === screen.height){return;}
	document.documentElement.style.height = "";
});

/* The document height needs to be set to a fixed value because as soon
 * as we enter fullscreen mode, the element gets removed from the
 * text flow, reducing the overall document height. Now as soon as we
 * return to the normal mode the browsers scroll changes because it is
 * larger than the overall document height. By setting it on entering
 * fullscreen (and removing the value later) we work around that issue.
 */
function openFullscreen(element) {
	document.documentElement.style.height = (document.documentElement.scrollHeight|0)+"px";
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else {
		return;
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
	} else {
		return;
	}
}