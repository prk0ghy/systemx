function showLazyIframe(ele){
	const newEle = document.createElement("IFRAME");
	newEle.setAttribute("frameborder","0");
	newEle.setAttribute("allowfullscreen","allowfullscreen");
	newEle.setAttribute("src",ele.getAttribute("src"));
	newEle.classList.add("h5p-iframe");
	ele.parentElement.insertBefore(newEle,ele);
	ele.remove();
}

function showEmbedSections(container){
	if(container === null){return;}
	for(const child of container.children){
		if(child.tagName !== "SECTION"){continue;}
		if(child.getAttribute("content-type") === "task"){
			showEmbedSections(child.querySelector("task-content"));
		}
		if(child.getAttribute("content-type") !== "embed"){continue;}
		for(const lazyIframe of child.querySelectorAll("lazy-iframe")){
			showLazyIframe(lazyIframe);
		}
	}
}

function showEmbedSectionsAll(containers){
	for(const curContainer of containers){
		showEmbedSections(curContainer);
	}
}

(()=>{
	function initLazyIframes(){
		showEmbedSections(document.querySelector("main"));
		showEmbedSectionsAll(document.querySelectorAll("task-content"));
	}
	setTimeout(initLazyIframes,0);
})();
