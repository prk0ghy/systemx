function showLazyIframe(ele){
	if(ele.classList.contains("hidden-embedding-placeholder")){return;}
	const iframeWrapper = document.createElement("IFRAME-WRAPPER");
	const newEle = document.createElement("IFRAME");
	newEle.setAttribute("frameborder","0");
	newEle.setAttribute("allowfullscreen","allowfullscreen");
	newEle.setAttribute("src",ele.getAttribute("src"));
	newEle.classList.add("h5p-iframe");
	iframeWrapper.append(newEle);
	ele.parentElement.insertBefore(iframeWrapper,ele);
	ele.classList.add("hidden-embedding-placeholder");
}

function showEmbeddingSections(container){
	if(container === null){return;}
	for(const child of container.children){
		if(child.tagName !== "SECTION"){continue;}
		if(child.getAttribute("content-type") === "task"){
			showEmbeddingSections(child.querySelector("task-content"));
		}
		if(child.getAttribute("content-type") !== "embedding"){continue;}
		for(const lazyIframe of child.querySelectorAll("lazy-iframe")){
			showLazyIframe(lazyIframe);
		}
	}
}

function showEmbeddingSectionsAll(containers){
	for(const curContainer of containers){
		showEmbeddingSections(curContainer);
	}
}

(()=>{
	function initLazyIframes(){
		showEmbeddingSections(document.querySelector("main"));
		showEmbeddingSectionsAll(document.querySelectorAll("task-content"));
	}
	setTimeout(initLazyIframes,0);
})();
