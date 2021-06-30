/* globals showEmbeddingSections,openFullscreen,closeFullscreen */

(() => {
	const initSupportSlider = () => {
		const boxes = document.querySelectorAll('section[content-type="tab-box"]');
		boxes.forEach(box => {
			const boxType = box.getAttribute('tab-box-type');
			if(boxType !== "support"){return;}
			const tabContentWrap = box.querySelector("tab-box-content-wrap");
			const tabContent     = tabContentWrap.querySelectorAll("tab-box-content");
			const startSlide     = document.createElement("START-SLIDE");
			const endSlide       = document.createElement("END-SLIDE");
			const controlWrap    = document.createElement("CONTROL-WRAP");

			startSlide.addEventListener("click", e => {
				e.stopPropagation();
				showSlide(0);
			});

			endSlide.addEventListener("click",e => {
				e.stopPropagation();
				showSlide(-1);
			});

			controlWrap.addEventListener("click",e => {
				e.stopPropagation();
				if(curSlide === -1){
					showSlide(0);
				} else if(curSlide === tabContent.length){
					showSlide(-1);
				}
			});

			const controlExit = document.createElement("BUTTON");
			controlExit.setAttribute("button-function","exit");
			controlExit.addEventListener("click", e => {
				e.stopPropagation();
				showSlide(-1);
			});
			controlWrap.append(controlExit);

			const controlMedia = document.createElement("BUTTON");
			controlMedia.setAttribute("button-function","media");
			controlMedia.addEventListener("click", e => {
				e.stopPropagation();
				playMedia(curSlide);
			});
			controlWrap.append(controlMedia);

			const controlPrevious = document.createElement("BUTTON");
			controlPrevious.setAttribute("button-function","previous");
			controlPrevious.addEventListener("click",e => {
				e.stopPropagation();
				showSlide(curSlide - 1);
			});
			controlWrap.append(controlPrevious);

			const sliderInfo = document.createElement("SLIDER-INFO");
			function refreshPageInfo(){
				sliderInfo.innerHTML = `${curSlide + 1} / ${tabContent.length}`;
			}
			controlWrap.append(sliderInfo);

			const controlNext = document.createElement("BUTTON");
			controlNext.setAttribute("button-function","next");
			controlNext.addEventListener("click",e => {
				e.stopPropagation();
				showSlide(curSlide + 1);
			});
			controlWrap.append(controlNext);

			tabContentWrap.prepend(startSlide);
			tabContentWrap.append(endSlide);
			tabContentWrap.append(controlWrap);
			let curSlide = -1;
			let mediaPlaying;

			const playMedia = i => {
				if((i < 0) || (i >= tabContent.length)){
					return;
				}
				if(mediaPlaying){
					mediaPlaying.pause();
					mediaPlaying.remove();
					mediaPlaying = undefined;
					return;
				}
				const slide = tabContent[i];
				const audio = document.createElement("AUDIO");
				audio.setAttribute("src",slide.getAttribute('tab-media'));
				audio.addEventListener("ended", () => {
					audio.remove();
					mediaPlaying = undefined;
				});
				audio.play();
				mediaPlaying = audio;
			};

			const removeActiveClassFromAllSlides = () => {
				for(const cContent of tabContent){
					cContent.classList.remove('active');
				}
				startSlide.classList.remove('active');
				endSlide.classList.remove('active');
				box.classList.remove("start-slide-active");
				box.classList.remove("end-slide-active");
				box.classList.remove("has-media");
			};

			const showStartSlide = () => {
				startSlide.classList.add('active');
				box.classList.add("start-slide-active");
				closeFullscreen();
				curSlide = -1;
			};

			const showEndSlide = () => {
				endSlide.classList.add('active');
				box.classList.add("end-slide-active");
				closeFullscreen();
				curSlide = tabContent.length;
			};

			const showSlide = i => {
				removeActiveClassFromAllSlides();
				if(i < 0){
					showStartSlide();
				}else if(i >= tabContent.length){
					showEndSlide();
				}else{
					if(curSlide < 0){openFullscreen(tabContentWrap);}
					const cContent = tabContent[i];
					cContent.classList.add('active');
					showEmbeddingSections(cContent);
					const media = cContent.getAttribute("tab-media");
					if(media && media !== ""){
						box.classList.add("has-media");
					}
					curSlide = i;
				}
				refreshPageInfo();
			};
			showSlide(-1);
		});
	};
	setTimeout(initSupportSlider,0);
})();
