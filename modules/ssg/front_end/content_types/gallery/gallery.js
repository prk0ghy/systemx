/* globals PhotoSwipe, PhotoSwipeUI_Default, configuration */

(() => {
	const initPhotoswipe = () => {
		const pswpMarkup = '<div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"> <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div></div></div></div>';
		const ele = document.createElement("DIV");
		ele.id = "pswp";
		ele.classList.add("pswp");
		ele.setAttribute("tabindex",1);
		ele.setAttribute("role","dialog");
		ele.setAttribute("aria-hidden","true");
		ele.innerHTML = pswpMarkup;
		document.querySelector("body").append(ele);
	};

	const initGallery = () => {
		const pswpElement = document.getElementById("pswp");
		const galleries = document.querySelectorAll('section[content-type="gallery"] > inner-content > details');
		galleries.forEach(gallery => {
			const button = document.createElement("BUTTON");
			const captionWrap = document.createElement("CAPTION-WRAP");
			gallery.parentElement.append(captionWrap);
			button.setAttribute("button-type","fullscreen");
			gallery.appendChild(button);
			const previousSlideButton = document.createElement("BUTTON");
			previousSlideButton.setAttribute("button-type","previous-slide");
			gallery.appendChild(previousSlideButton);
			const nextSlideButton = document.createElement("BUTTON");
			nextSlideButton.setAttribute("button-type","next-slide");
			gallery.appendChild(nextSlideButton);
			const items = [];
			for(const figure of gallery.querySelectorAll('figure')){
				const imgTag = figure.querySelector("img");
				if(!imgTag){continue;}
				const src   = imgTag.getAttribute("raw-width") || imgTag.getAttribute("src");
				const msrc  = imgTag.getAttribute("src");
				const w     = (imgTag.getAttribute("raw-width") | 0) || (imgTag.getAttribute("width") | 0);
				const h     = (imgTag.getAttribute("raw-height")| 0) || (imgTag.getAttribute("height") | 0);
				const figcaption = figure.querySelector("figcaption");
				const title = figcaption ? figcaption.innerHTML : "";
				items.push({src,w,h,msrc,title,figure,figcaption,imgTag});
				captionWrap.append(figcaption);
				figure.classList.add("hidden");
				figcaption.classList.add("hidden");
			}
			items[0].figure.classList.remove("hidden");
			items[0].figcaption.classList.remove("hidden");
			gallery.setAttribute("open",true);
			if(items.count === 0){return;}
			const options = {
				index:0,
				loop: configuration.galleryWrapAround,
				bgOpacity: configuration.galleryBackgroundOpacity,
				closeOnScroll: false,
				shareEl: false,
				getThumbBoundsFn:()=>{
					const rect = items[options.index].imgTag.getBoundingClientRect();
					const ret = {
						x: rect.x|0,
						y:(rect.y|0) + (document.children[0].scrollTop),
						w:rect.width|0
					};
					return ret;
				}
			};

			const setSlideWrap = i => {
				i = i|0;
				if(i < 0){
					if(items.length <= 0){return;}
					setSlide(items.length-1);
					return;
				}else if(i >= items.length){
					setSlide(0);
					return;
				}

				let ci = 0;
				for(const slide of items){
					if(ci++ === i){
						slide.figure.classList.remove("hidden");
						slide.figcaption.classList.remove("hidden");
					}else{
						slide.figure.classList.add("hidden");
						slide.figcaption.classList.add("hidden");
					}
				}
				options.index = i;
			};

			const setSlideNoWrap = i => {
				i = i|0;
				if(configuration.galleryWrapAround){
					if(i < 0){
						if(items.length <= 0){return;}
						setSlide(items.length-1);
						return;
					}else if(i >= items.length){
						setSlide(0);
						return;
					}
				}else{
					if(i < 0){
						if(items.length <= 0){return;}
						setSlide(0);
						return;
					}else if(i >= items.length){
						setSlide(items.length-1);
						return;
					}
				}

				let ci = 0;
				for(const slide of items){
					if(ci++ === i){
						slide.figure.classList.remove("hidden");
						slide.figcaption.classList.remove("hidden");
					}else{
						slide.figure.classList.add("hidden");
						slide.figcaption.classList.add("hidden");
					}
				}
				options.index = i;
			};

			const setSlide = configuration.galleryWrapAround ? setSlideWrap : setSlideNoWrap;

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
	};

	const initLightbox = () => {
		const pswpElement = document.getElementById("pswp");
		const singles = document.querySelectorAll('figure[figure-type="picture"],figure[figure-type="hero-image"]');
		const doNothingSpecial = e => {e.stopPropagation();};
		singles.forEach(single => {
			const items = [];
			const figCaption = single.querySelector("figcaption");
			{
				const imgTag = single.querySelector("img");
				if(imgTag === null){return;}
				const src   =  imgTag.getAttribute("raw-src") || imgTag.getAttribute("src");
				const msrc  =  imgTag.getAttribute("src");
				const w     = (imgTag.getAttribute("raw-width") | 0) || (imgTag.getAttribute("width"));
				const h     = (imgTag.getAttribute("raw-height")| 0) || (imgTag.getAttribute("height"));
				const title = figCaption ? figCaption.innerHTML : "";
				items.push({src,w,h,title});
			}

			const options = {
				index:0,
				bgOpacity: configuration.galleryBackgroundOpacity,
				closeOnScroll: false,
				shareEl: false,
				getThumbBoundsFn:()=>{
					const rect = single.getBoundingClientRect();
					const ret = {
						x: rect.x|0,
						y:(rect.y|0) + (document.children[0].scrollTop),
						w:rect.width|0
					};
					return ret;
				}
			};
			if(items.count === 0){return;}

			const button = document.createElement("BUTTON");
			button.setAttribute("button-type","fullscreen");
			single.insertBefore(button,figCaption);

			for(const link of single.querySelectorAll("a")){
				link.addEventListener("click",doNothingSpecial);
			}

			single.addEventListener("click", e => e.preventDefault());
			button.addEventListener("click", e => {
				e.preventDefault();
				const gal = new PhotoSwipe(pswpElement,PhotoSwipeUI_Default,items,options);
				gal.init();
				gal.listen('close', () => button.classList.remove("active"));
				button.classList.add("active");
			});
		});
	};
	setTimeout(initPhotoswipe,0);
	setTimeout(initGallery,0);
	setTimeout(initLightbox,0);
})();
