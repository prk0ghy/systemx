/* globals addHideElementContentHandler */

(() => {
	let tabindex = 100;

	const initMedia = media => {
		if(media.getAttribute('controls') === null){return;}
		media.removeAttribute('controls'); // Remove Browser based controls via JS, so we have them as a fallback when JS is disabled
		media.volume = 1.0; // Force volume to 100% on init

		media.removeAttribute('controls');
		media.setAttribute('tabindex',tabindex++);

		const wrapper = document.createElement("MEDIA-WRAP");
		media.parentElement.insertBefore(wrapper,media);
		wrapper.appendChild(media);
		wrapper.setAttribute("media-type",media.tagName === "AUDIO" ? "audio" : "video");

		const controlsWrapper = document.createElement("MEDIA-CONTROLS");
		wrapper.appendChild(controlsWrapper);

		const seekbar = document.createElement("MEDIA-SEEKBAR");
		controlsWrapper.appendChild(seekbar);

		const seekbarMark = document.createElement("MEDIA-SEEKBAR-MARK");
		seekbar.appendChild(seekbarMark);

		const controlsWrapperLeft = document.createElement("MEDIA-CONTROLS-LEFT");
		controlsWrapper.appendChild(controlsWrapperLeft);

		const controlsWrapperRight = document.createElement("MEDIA-CONTROLS-RIGHT");
		controlsWrapper.appendChild(controlsWrapperRight);

		const playPauseButton = document.createElement("MEDIA-PLAY-PAUSE");
		controlsWrapperLeft.appendChild(playPauseButton);

		let posterframe = null;
	
		if (media.tagName === "VIDEO"){
			if(media.poster){
				let postersource = media.getAttribute('poster');
				posterframe = document.createElement("IMG");
				posterframe.addEventListener("transitionend", () => {
					posterframe.remove();
				});
				posterframe.src = postersource;
				wrapper.prepend(posterframe);
			}
		}

		function showStatusIcon(iconName){
			const statusIcon = document.createElement("MEDIA-STATUS-ICON");
			statusIcon.setAttribute('icon-name',iconName);
			wrapper.appendChild(statusIcon);
			statusIcon.offsetTop; // Sync
			statusIcon.classList.add('fading-out');

			statusIcon.addEventListener("transitionend", () => {
				statusIcon.remove();
			});
		}

		if(media){
			const mp = media.parentElement;
			if(mp){
				const mpp = mp.parentElement;
				if(mpp){
					const mppfc = mpp.firstElementChild;
					if(mppfc && mppfc.tagName === 'IMG'){
						media.parentElement.parentElement.firstElementChild.addEventListener("click", (e) => {
							e.preventDefault();
							playPauseButton.click();
						});
					}
				}
			}
		}

		media.addEventListener("click", e => {
			e.preventDefault();
			playPauseButton.click();
		});

		let hideControlsTimeout = undefined;
		const refreshHideControlsTimeout = () => {
			controlsWrapper.classList.remove('hidden');
			if(hideControlsTimeout !== undefined){
				clearTimeout(hideControlsTimeout);
			}
			hideControlsTimeout = setTimeout(() => {
				if(!media.paused){
					controlsWrapper.classList.add('hidden');
				}
			},1000);
		};
		media.addEventListener("mousemove",() =>{
			refreshHideControlsTimeout();
		});

		playPauseButton.addEventListener("click",e => {
			e.preventDefault();
			media.focus();
			if(media.paused){
				playPauseButton.classList.add('active');
				refreshHideControlsTimeout();
				media.play();
				showStatusIcon('play');
				posterframe.classList.add('fadeout');
			} else {
				playPauseButton.classList.remove('active');
				controlsWrapper.classList.remove('hidden');
				media.pause();
				showStatusIcon('pause');
			}
		});

		media.addEventListener("ended", () => {
			if(!media.paused){media.pause();}
			media.currentTime = 0;
			playPauseButton.classList.remove('active');
			controlsWrapper.classList.remove('hidden');
		});

		if(media.tagName === "VIDEO"){
			const fullscreenButton = document.createElement("MEDIA-FULLSCREEN");
			controlsWrapperRight.appendChild(fullscreenButton);
			fullscreenButton.addEventListener("click", (e) => {
				e.preventDefault();
				if(document.fullscreenElement === null){
					fullscreenButton.classList.add('active');
					wrapper.requestFullscreen();
				} else {
					fullscreenButton.classList.remove('active');
					document.exitFullscreen();
				}
			});

			document.addEventListener('fullscreenchange', () => {
				if (document.fullscreenElement === wrapper) {
					fullscreenButton.classList.add('active');
				} else {
					fullscreenButton.classList.remove('active');
				}
			});
		}

		const volumeButton = document.createElement("MEDIA-VOLUME-BUTTON");
		controlsWrapperLeft.appendChild(volumeButton);

		const volumeSlider = document.createElement("MEDIA-VOLUME-SLIDER");
		controlsWrapperLeft.appendChild(volumeSlider);

		const volumeSliderMark = document.createElement("MEDIA-VOLUME-SLIDER-MARK");
		volumeSlider.appendChild(volumeSliderMark);

		volumeButton.addEventListener("click", e => {
			if(e.buttons !== 0){return;}
			e.preventDefault();
			if(!media.muted){
				volumeButton.classList.add('active');
				media.muted = true;
				volumeSliderMark.style.width = "0%";
			} else{
				volumeButton.classList.remove('active');
				media.muted = false;
				volumeSliderMark.style.width = (media.volume*100.00) +"%";
			}
		});

		const secondsToTimestamp = ts => {
			const minutes = (ts / 60)|0;
			const seconds = (ts - minutes * 60)|0;
			const minuteValue = minutes < 10 ? `0${minutes}` : `${minutes}`;
			const secondValue = seconds < 10 ? `0${seconds}` : `${seconds}`;
			return `${minuteValue}:${secondValue}`;
		};

		const volumeMouseHandler = e => {
			if((e !== undefined) && (e.buttons === 1)){
				const rect = volumeSlider.getBoundingClientRect();
				const volume = Math.max(0.01,Math.min(1,(e.x-rect.x)/rect.width));
				media.volume = volume;
				media.muted = false;
			}
			if(media.muted || media.volume <= 0.02){
				media.muted = true;
				volumeButton.classList.add('active');
				volumeButton.setAttribute("volume-level",0);
				volumeSliderMark.style.width = "0";
			}else{
				media.muted = false;
				volumeButton.classList.remove('active');
				volumeButton.setAttribute("volume-level",0|((media.volume/0.33)+1));
				volumeSliderMark.style.width = (media.volume*100.0)+"%";
			}
		};
		volumeSlider.addEventListener("mousedown", volumeMouseHandler);
		volumeSlider.addEventListener("mousemove", volumeMouseHandler);

		const timestampWrapper = document.createElement("MEDIA-TIMESTAMP-WRAPPER");
		controlsWrapperLeft.appendChild(timestampWrapper);

		const timestamp = document.createElement("MEDIA-TIMESTAMP");
		timestampWrapper.appendChild(timestamp);

		const duration = document.createElement("MEDIA-DURATION");
		timestampWrapper.appendChild(duration);

		timestamp.innerText = secondsToTimestamp(0);
		duration.innerText = secondsToTimestamp(media.duration);

		const seekbarUpdate = () => {
			const curPos = (media.currentTime/media.duration);
			seekbarMark.style.width = (curPos*100.0)+"%";
			timestamp.innerText = secondsToTimestamp(media.currentTime);
		};

		media.addEventListener('timeupdate',seekbarUpdate);
		media.addEventListener('durationchange', () => {
			duration.innerText= secondsToTimestamp(media.duration);
		});

		const seekbarHandler = e => {
			if(e.buttons !== 1){return;}
			const rect = seekbar.getBoundingClientRect();
			const curPos = Math.min(1,(e.x-rect.x)/rect.width);
			seekbarMark.style.width = (curPos*100.0)+"%";
			media.currentTime = (curPos*media.duration)|0;
			seekbarUpdate();
		};
		seekbar.addEventListener("mousedown", seekbarHandler);
		seekbar.addEventListener("mousemove", seekbarHandler);

		document.addEventListener("keydown", e => {
			const focusedVideo = document.activeElement;
			if(focusedVideo === null){return;}
			if(focusedVideo !== media){return;}

			if(e.key === ' ') {
				e.preventDefault();
				playPauseButton.click();
			}
			else if(e.key === 'm'){
				volumeButton.click();
			}
			else if(e.key ==='ArrowUp' && media.volume < 1.0){
				e.preventDefault();
				media.volume = Math.min(1.0,media.volume + 0.05);
				volumeMouseHandler();

			}
			else if(e.key === 'ArrowDown' && media.volume > 0.0){
				e.preventDefault();
				media.volume = Math.max(0.0,media.volume - 0.05);
				volumeMouseHandler();
			} else if(e.key === 'ArrowRight'){
				media.currentTime +=5;
			} else if(e.key === 'ArrowLeft'){
				media.currentTime -=5;
			} else if(e.key === 'Home' || e.key === '0'){
				e.preventDefault();
				media.currentTime = 0;
			} else if(e.key === 'End'){
				e.preventDefault();
				media.currentTime = media.duration;
			} else if(e.key === '1'){
				media.currentTime = (media.duration/100*10);
			} else if(e.key === '2'){
				media.currentTime = (media.duration/100*20);
			} else if(e.key === '3'){
				media.currentTime = (media.duration/100*30);
			} else if(e.key === '4'){
				media.currentTime = (media.duration/100*40);
			} else if(e.key === '5'){
				media.currentTime = (media.duration/100*50);
			} else if(e.key === '6'){
				media.currentTime = (media.duration/100*60);
			} else if(e.key === '7'){
				media.currentTime = (media.duration/100*70);
			} else if(e.key === '8'){
				media.currentTime = (media.duration/100*80);
			} else if(e.key === '9'){
				media.currentTime = (media.duration/100*90);
			}
		});
	};

	const initAllMedia = () => {
		const getVideos = document.querySelectorAll('video');
		for (const video of getVideos){
			initMedia(video);
		}

		const getAudios = document.querySelectorAll('audio');
		for (const audio of getAudios){
			initMedia(audio);
		}

		addHideElementContentHandler("stopMedia",ele => {
			for(const e of ele.querySelectorAll('media-wrap audio, media-wrap video')){
				e.dispatchEvent(new CustomEvent("ended",{}));
			}
		});
	};
	setTimeout(initAllMedia,0);
})();
