/* globals showModal,showEmbeddingSections,openFullscreen,closeFullscreen,hideElementContentHandler */


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

			const showLicense = () => {
				const html = [];
				for(let i=0;i<tabContent.length;i++){
					let tmp = "";

					const licenses = tabContent[i].querySelectorAll("details.license");
					for(const c of licenses){
						tmp += `<div>${c.querySelector("license-content").innerHTML}</div>`;
					}

					const sources = tabContentWrap.querySelectorAll(`tab-box-source[tab-index="${i}"]`);
					for(const source of sources){
						tmp += `<div>${source.innerHTML}</div>`;
					}

					if(tmp !== ""){
						html.push(`<h2>${i+1}</h2>${tmp}`);
					}
				}
				showModal(html.join("<hr/>"));
			};

			const button         = document.createElement("BUTTON");
			button.setAttribute("button-type","license");
			button.addEventListener("click",showLicense);
			tabContentWrap.parentElement.append(button);


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
			controlMedia.innerText = "Vorlesen";
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
					if(mediaPlaying.paused){
						mediaPlaying.play();
						controlMedia.classList.add('playing');
					}else{
						mediaPlaying.pause();
						controlMedia.classList.remove('playing');
					}
					return;
				}
				const slide = tabContent[i];
				const audio = document.createElement("AUDIO");
				audio.setAttribute("src",slide.getAttribute('tab-media'));
				audio.addEventListener("ended", () => {
					audio.remove();
					controlMedia.classList.remove('playing');
					mediaPlaying = undefined;
				});
				controlMedia.classList.add('playing');
				audio.play();
				mediaPlaying = audio;
			};

			const removeActiveClassFromAllSlides = () => {
				for(const cContent of tabContent){
					cContent.classList.remove('active');
					hideElementContentHandler(cContent);
				}
				startSlide.classList.remove('active');
				endSlide.classList.remove('active');
				box.classList.remove("start-slide-active");
				box.classList.remove("end-slide-active");
				box.classList.remove("has-media");
				if(mediaPlaying){
					mediaPlaying.pause();
					mediaPlaying.remove();
					mediaPlaying = undefined;
					controlMedia.classList.remove('playing');
				}
			};

			const centerSlide = i => {
				const content = tabContent[i];
				const maxHeight = (tabContentWrap.clientHeight - controlWrap.offsetHeight);
				const curHeight = content.scrollHeight;
				if(curHeight >= maxHeight){
					content.style.paddingTop = '';
				}else{
					content.style.paddingTop = `${(maxHeight - curHeight) / 2}px`;
				}
			};

			const resizeSlide = i => {
				if((i < 0) || (i >= tabContent.length)){return;}
				const content = tabContent[i];
				const maxHeight = (tabContentWrap.clientHeight - controlWrap.offsetHeight) * 0.9;
				let fs = 2.55;
				for(let step = 1.0; step > 0.01; step *= 0.5){
					content.style.fontSize = `${fs}em`;
					const curHeight = content.scrollHeight;
					if(curHeight > maxHeight){
						fs -= step;
					}else{
						fs += step;
					}
				}
				if(fs < 1.1){fs = 1;}
				if(fs > 4.0){fs = 4;}
				content.style.fontSize = `${fs}em`;
				const imgs = content.querySelectorAll(`figure[figure-type="picture"][figure-width="100"] img`);
				for(const img of imgs){
					img.style.maxHeight = `${maxHeight}px`;
				}
				centerSlide(i);
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
					resizeSlide(curSlide);
				}
				refreshPageInfo();
			};
			showSlide(-1);

			/* Reset to start-slide when leaving fullscreen mode */
			document.addEventListener("fullscreenchange", () => {
				if((curSlide < 0) || (curSlide >= tabContent.length)){return;}
				if( window.innerHeight === screen.height){
					resizeSlide(curSlide);
					return;
				}
				if(curSlide === tabContent.length){return;}
				showSlide(-1);
			});
			document.addEventListener("resize", () => {
				if((curSlide < 0) || (curSlide >= tabContent.length)){return;}
				resizeSlide(curSlide);
			});
		});
	};
	setTimeout(initSupportSlider,0);
})();
