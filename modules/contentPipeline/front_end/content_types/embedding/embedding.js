/* global addHideElementContentHandler,continueWhenAllowed,embedsAllowed,canUseEmbeds */

const calculateAspectRatio = (() => {
	const plistGetf = (arr,key) => {
		for(let i=0;i<arr.length-1;i++){
			if(arr[i] === key){return arr[i+1];}
		}
		return null;
	};

	return (ele) => {
		const src = ele.getAttribute("src");
		if(!src || !src.includes("geogebra.org/")){return;}
		const srcArr = src.split("/");
		const width = plistGetf(srcArr,"width");
		const height = plistGetf(srcArr,"height");
		if(!width || !height){return;}
		const ar = width / height;
		ele.setAttribute("aspect-ratio",ar);
	};
})();

const isThirdPartyHref = url => {
	const arr = url.split("/");
	if(arr.length < 3){return true;}
	if(url.indexOf("usesExternalSources=1") >= 0){return true;}
	const whitelist = {
		"h5p.test-dilewe.de": false,
		"jura-museum-h5p.dilewe.de": false,
		"h5p-hessen.test-dilewe.de": false
	};
	if(whitelist[arr[2]] !== undefined){return whitelist[arr[2]];}
	return true;
};

const showLazyIframe = async ele => {
	if(ele.classList.contains("hidden-embedding-placeholder")){return;}
	if(!embedsAllowed() && isThirdPartyHref(ele.getAttribute("src"))){
		ele.addEventListener("click", canUseEmbeds);
		ele.classList.add("waiting-for-approval");
		await continueWhenAllowed();
		ele.removeEventListener("click", canUseEmbeds);
		ele.classList.remove("waiting-for-approval");
	}

	const iframeWrapper = document.createElement("IFRAME-WRAPPER");
	const newEle = document.createElement("IFRAME");
	newEle.setAttribute("frameborder","0");
	newEle.setAttribute("allowfullscreen","allowfullscreen");

	const allow = ele.getAttribute("allow");
	if(allow){
		newEle.setAttribute("allow",allow);
	}

	newEle.setAttribute("src",ele.getAttribute("src"));
	if(String(ele.getAttribute("src")).indexOf("h5p") >= 0){newEle.classList.add("h5p-iframe");}
	calculateAspectRatio(newEle);
	iframeWrapper.append(newEle);
	ele.parentElement.insertBefore(iframeWrapper,ele);
	ele.classList.add("hidden-embedding-placeholder");
	newEle.contentWindow.postMessage({context: 'h5p', action: 'ready'}, '*');
	resizeEmbedding(newEle);
};

const showEmbeddingSections = container => {
	if(container === null){return;}
	for(const child of container.children){
		if(child.tagName === "LAZY-IFRAME"){
			showLazyIframe(child);
			continue;
		}
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

const resizeEmbedding = ele => {
	const arRaw = ele.getAttribute('aspect-ratio');
	const ar = arRaw ? parseFloat(arRaw) : 1.5;
	ele.style.height = `${((ele.clientWidth / ar)|0)+1}px`;
};

const resizeEmbeddings = () => {
	for(const e of document.querySelectorAll('iframe[aspect-ratio]')){
		resizeEmbedding(e);
	}
};

(()=>{
	addHideElementContentHandler("hideEmbeddings",ele => {
		for(const e of ele.querySelectorAll('iframe-wrapper')){
			e.remove();
		}
		for(const e of ele.querySelectorAll('.hidden-embedding-placeholder')){
			e.classList.remove('hidden-embedding-placeholder');
		}
	});

	function initLazyIframes(){
		showEmbeddingSections(document.querySelector("main"));
	}
	setTimeout(initLazyIframes,0);
	window.addEventListener('resize', resizeEmbeddings);
})();

//because the resizing should trigger once after all ressources are loaded
window.addEventListener("load", () => {
	setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 0);
});
