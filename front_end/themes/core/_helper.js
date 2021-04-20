/* This File should contain little helper functions to be used around the codebase */
/* exported getFirstParentSection,addHideElementContentHandler,hideElementContentHandler */

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
