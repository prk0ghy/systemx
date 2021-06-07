/* globals PhotoSwipe, PhotoSwipeUI_Default */

(()=>{
	function initPhotoswipe(){
		const pswpMarkup = '<div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"> <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div></div></div></div>';
		const ele = document.createElement("DIV");
		ele.id = "pswp";
		ele.classList.add("pswp");
		ele.setAttribute("tabindex",1);
		ele.setAttribute("role","dialog");
		ele.setAttribute("aria-hidden","true");
		ele.innerHTML = pswpMarkup;
		document.querySelector("body").append(ele);
	}

	function initGallery(){
		const pswpElement = document.getElementById("pswp");
		const galleries = document.querySelectorAll('section[content-type="gallery"] > inner-content > details');
		galleries.forEach(gallery => {
			const button = document.createElement("BUTTON");
			button.setAttribute("button-type","fullscreen");
			gallery.appendChild(button);
			const previousSlideButton = document.createElement("BUTTON");
			previousSlideButton.setAttribute("button-type","previous-slide");
			gallery.appendChild(previousSlideButton);
			const nextSlideButton = document.createElement("BUTTON");
			nextSlideButton.setAttribute("button-type","next-slide");
			gallery.appendChild(nextSlideButton);
			const items = [];
			for(const img of gallery.children){
				const imgTag = img.querySelector("img");
				if(imgTag === null){continue;}
				const src   = imgTag.src;
				const w     = imgTag.getAttribute("width")|0;
				const h     = imgTag.getAttribute("height")|0;
				const figCaption = img.querySelector("figcaption");
				const title = figCaption ? figCaption.innerHTML : "";
				items.push({src,w,h,title});
			}
			const slides = gallery.querySelectorAll(`figure[figure-type="gallery"]`);
			slides.forEach(e => e.classList.add("hidden"));
			slides[0].classList.remove("hidden");
			gallery.setAttribute("open",true);
			if(items.count === 0){return;}
			const options = {
				index:0,
				bgOpacity: 0.5,
				closeOnScroll: false,
				getThumbBoundsFn:()=>{
					const rect = slides[options.index].getBoundingClientRect();
					const ret = {
						x: rect.x|0,
						y:(rect.y|0) + (document.children[0].scrollTop),
						w:rect.width|0
					};
					return ret;
				}
			};

			function setSlide(i){
				i = i|0;
				if(i < 0){
					if(slides.length <= 0){return;}
					setSlide(slides.length-1);
					return;
				}else if(i >= slides.length){
					setSlide(0);
					return;
				}
				let ci = 0;
				for(const img of slides){
					if(ci++ === i){
						img.classList.remove("hidden");
					}else{
						img.classList.add("hidden");
					}
				}
				options.index = i;
			}
			gallery.addEventListener("click", e => e.preventDefault());
			button.addEventListener("click",e => {
				e.preventDefault();
				const gal = new PhotoSwipe(pswpElement,PhotoSwipeUI_Default,items,options);
				gal.init();
				gal.listen('close', () => button.classList.remove("active"));
				gal.listen('beforeChange', () => setSlide(gal.getCurrentIndex()));
				button.classList.add("active");
			});
			previousSlideButton.addEventListener("click", () => setSlide(options.index - 1));
			nextSlideButton.addEventListener("click", () => setSlide(options.index + 1));
		});
	}
	setTimeout(initPhotoswipe,0);
	setTimeout(initGallery,0);
})();
