const showLazyIframe = ele => {
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
	newEle.contentWindow.postMessage({context: 'h5p', action: 'ready'}, '*');
};

const showEmbeddingSections = container => {
	if(container === null){return;}
	for(const child of container.children){
		if(child.tagName !== "SECTION"){continue;}
		if(child.getAttribute("content-type") === "exercise"){
			showEmbeddingSections(child.querySelector("exercise-content"));
		}
		if(child.getAttribute("content-type") !== "embedding"){continue;}
		for(const iframe of child.querySelectorAll("iframe")){
			iframe.contentWindow.postMessage({context: 'h5p', action: 'resize'}, '*');
		}
		for(const lazyIframe of child.querySelectorAll("lazy-iframe")){
			showLazyIframe(lazyIframe);
		}
	}
};

const showEmbeddingSectionsAll = containers => {
	for(const curContainer of containers){
		showEmbeddingSections(curContainer);
	}
};

(()=>{
	function initLazyIframes(){
		showEmbeddingSections(document.querySelector("main"));
		showEmbeddingSectionsAll(document.querySelectorAll("exercise-content"));
	}
	setTimeout(initLazyIframes,0);
})();