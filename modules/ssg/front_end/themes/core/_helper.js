/* This File should contain little helper functions to be used around the codebase */
/* exported getFirstParentSection,addHideElementContentHandler,hideElementContentHandler,openFullscreen,closeFullscreen,fileExtension,downloadData */
/* global callOverlayCloseHandlers */

const getFirstParentSection = ele => {
	if(!ele){return null;}
	if(ele.tagName === 'SECTION'){return ele;}
	return getFirstParentSection(ele.parentElement);
};

const fileExtension = filename => {
	const i = filename.lastIndexOf(".");
	return i < 0 ? "" : filename.substr(i+1).toLowerCase();
};

/* Download some content immediatly */
const downloadData = (filename, data) => {
	const a = document.createElement('a');
	a.setAttribute('href', data);
	a.setAttribute('download', filename);
	a.style.display = 'none';

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

const hideElementContentHandlerList = {};
/* Use this function to add functions that disable active elements, such as iframes/videos */
const addHideElementContentHandler = (name,handler) => {
	hideElementContentHandlerList[name] = handler;
};

/* Should be called on elements that are loosing visiblity or getting deactivated/disabled */
const hideElementContentHandler = ele => {
	for(const name in hideElementContentHandlerList){
		hideElementContentHandlerList[name](ele);
	}
};

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
const openFullscreen = element => {
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
};

const isFullscreen = () => document.fullscreenElement !== null;

const closeFullscreen = () => {
	callOverlayCloseHandlers();
	if(!isFullscreen()){return;}
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	} else {
		return;
	}
};
