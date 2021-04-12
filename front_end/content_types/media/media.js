(() => {
	function initMedia(media) {
		media.removeAttribute('controls'); // Remove Browser based controls via JS, so we have them as a fallback when JS is disabled
		media.volume = 1.0; // Force volume to 100% on init

		media.removeAttribute('controls');

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

		function showStatusIcon(iconName){
			const statusIcon = document.createElement("MEDIA-STATUS-ICON");
			statusIcon.setAttribute('icon-name',iconName);
			wrapper.appendChild(statusIcon);
			statusIcon.offsetTop; // Sync
			statusIcon.classList.add('fading-out');

			statusIcon.addEventListener("transitionend", (e) => {
				statusIcon.remove();
			});
		}

		if(media?.parentElement?.parentElement?.firstElementChild?.tagName === 'IMG'){
			media.parentElement.parentElement.firstElementChild.addEventListener("click", (e) => {
				e.preventDefault();
				playPauseButton.click();
			});
		}
		media.addEventListener("click", (e) => {
			e.preventDefault();
			playPauseButton.click();
		});

		playPauseButton.addEventListener("click",(e) => {
			e.preventDefault();
			if(media.paused){
				playPauseButton.classList.add('active');
				media.play();
				showStatusIcon('play');
			} else {
				playPauseButton.classList.remove('active');
				media.pause();
				showStatusIcon('pause');
			}
		});

		const fullscreenButton = document.createElement("MEDIA-FULLSCREEN");
		controlsWrapperRight.appendChild(fullscreenButton);

		fullscreenButton.addEventListener("click", (e) => {
			e.preventDefault();
			if(document.fullscreenElement === null){
				fullscreenButton.classList.add('active');
				wrapper.requestFullscreen();
			} else{
				fullscreenButton.classList.remove('active');
				document.exitFullscreen();
			}
		});
		document.addEventListener('fullscreenchange', (e) => {
			if (document.fullscreenElement === wrapper) {
				fullscreenButton.classList.add('active');
			} else{
				fullscreenButton.classList.remove('active');
			}
		});

		const volumeButton = document.createElement("MEDIA-VOLUME-BUTTON");
		controlsWrapperLeft.appendChild(volumeButton);

		const volumeSlider = document.createElement("MEDIA-VOLUME-SLIDER");
		controlsWrapperLeft.appendChild(volumeSlider);

		const volumeSliderMark = document.createElement("MEDIA-VOLUME-SLIDER-MARK");
		volumeSlider.appendChild(volumeSliderMark);

		volumeButton.addEventListener("click", (e) => {
			if(e.buttons !== 1){return;}
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

		function secondsToTimestamp(ts){
			const minutes = (ts / 60)|0;
			const seconds = (ts - minutes * 60)|0;
			const minuteValue = minutes < 10 ? `0${minutes}` : `${minutes}`;
			const secondValue = seconds < 10 ? `0${seconds}` : `${seconds}`;
			return `${minuteValue}:${secondValue}`;
		}

		function volumeMouseHandler(e){
			if(e.buttons !== 1){return;}
			const rect = volumeSlider.getBoundingClientRect();
			const volume = Math.max(0.01,Math.min(1,(e.x-rect.x)/rect.width));
			volumeSliderMark.style.width = (volume*100.0)+"%";
			media.volume = volume;
			if(volume <= 0.02){
				media.muted = true;
				volumeButton.classList.add('active');
				volumeButton.setAttribute("volume-level",0);
			}else{
				media.muted = false;
				volumeButton.classList.remove('active');
				volumeButton.setAttribute("volume-level",0|((volume/0.33)+1));
			}
		}
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

		function seekbarUpdate(){
			const curPos = (media.currentTime/media.duration);
			seekbarMark.style.width = (curPos*100.0)+"%";
			timestamp.innerText = secondsToTimestamp(media.currentTime);
		}

		media.addEventListener('timeupdate',seekbarUpdate);
		media.addEventListener('durationchange', () => {
			duration.innerText= secondsToTimestamp(media.duration);
		});

		function seekbarHandler(e){
			if(e.buttons !== 1){return;}
			const rect = seekbar.getBoundingClientRect();
			const curPos = Math.min(1,(e.x-rect.x)/rect.width);
			seekbarMark.style.width = (curPos*100.0)+"%";
			media.currentTime = (curPos*media.duration)|0;
			seekbarUpdate();
		}
		seekbar.addEventListener("mousedown", seekbarHandler);
		seekbar.addEventListener("mousemove", seekbarHandler);
	}

	function initAllMedia() {
		const getVideos = document.querySelectorAll('video');
		for (const video of getVideos){
			initMedia(video);
		}

		const getAudios = document.querySelectorAll('audio');
		for (const audio of getAudios){
			initMedia(audio);
		}
	}
	setTimeout(initAllMedia,0);
})();
