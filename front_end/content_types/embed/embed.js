function showLazyIframe(ele){
	const newEle = document.createElement("IFRAME");
	newEle.setAttribute("frameborder","0");
	newEle.setAttribute("allowfullscreen","allowfullscreen");
	newEle.setAttribute("src",ele.getAttribute("src"));
	ele.parentElement.append(newEle);
	ele.remove();
}

function showEmbedSections(container){
	for(const child of container.children){
		if(child.getAttribute("content-type") !== "embed"){continue;}
		for(const lazyIframe of child.querySelectorAll("lazy-iframe")){
			showLazyIframe(lazyIframe);
		}
	}
}

(()=>{
	function initLazyIframes(){
		showEmbedSections(document.querySelector("main"));
	}
	setTimeout(initLazyIframes,0);
})();
