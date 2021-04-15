/* This File should contain little helper functions to be used around the codebase */
/* exported getFirstParentSection */

function getFirstParentSection(ele){
	if(!ele){return null;}
	if(ele.tagName === 'SECTION'){return ele;}
	return getFirstParentSection(ele.parentElement);
}
