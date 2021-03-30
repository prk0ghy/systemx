(() => {

	function initVideo(video) {
		video.removeAttribute('controls'); // Remove Browser based controls via JS, so we have them as a fallback when JS is disabled
		video.volume = 1.0; // Force volume to 100% on init

		const wrapper = document.createElement("AV-WRAP");
		video.parentElement.insertBefore(wrapper,video);
		wrapper.appendChild(video);

		const controlsWrapper = document.createElement("AV-CONTROLS");
		wrapper.appendChild(controlsWrapper);

		const seekbar = document.createElement("AV-SEEKBAR");
		controlsWrapper.appendChild(seekbar);

		const seekbarMark = document.createElement("AV-SEEKBAR-MARK");
		seekbar.appendChild(seekbarMark);

		const controlsWrapperLeft = document.createElement("AV-CONTROLS-LEFT");
		controlsWrapper.appendChild(controlsWrapperLeft);

		const controlsWrapperRight = document.createElement("AV-CONTROLS-RIGHT");
		controlsWrapper.appendChild(controlsWrapperRight);

		const playPauseButton = document.createElement("AV-PLAY-PAUSE");
		controlsWrapperLeft.appendChild(playPauseButton);

		playPauseButton.addEventListener("click",(e) => {
			e.preventDefault();
			if(video.paused){
				playPauseButton.classList.add('active');
				video.play();
			} else {
				playPauseButton.classList.remove('active');
				video.pause();
			}
		});

		const fullscreenButton = document.createElement("AV-FULLSCREEN");
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

		const volumeButton = document.createElement("AV-VOLUME-BUTTON");
		controlsWrapperLeft.appendChild(volumeButton);

		const volumeSlider = document.createElement("AV-VOLUME-SLIDER");
		controlsWrapperLeft.appendChild(volumeSlider);

		const volumeSliderMark = document.createElement("AV-VOLUME-SLIDER-MARK");
		volumeSlider.appendChild(volumeSliderMark);

		volumeButton.addEventListener("click", (e) => {
			e.preventDefault();
			if(!video.muted){
				volumeButton.classList.add('active');
				video.muted = true;
				volumeSliderMark.style.width = "0%";
			} else{
				volumeButton.classList.remove('active');
				video.muted = false;
				volumeSliderMark.style.width = (video.volume*100.00) +"%";
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
			video.volume = volume;
			if(volume <= 0.02){
				video.muted = true;
				volumeButton.classList.add('active');
				volumeButton.setAttribute("volume-level",0);
			}else{
				video.muted = false;
				volumeButton.classList.remove('active');
				volumeButton.setAttribute("volume-level",0|((volume/0.33)+1));
			}
		}
		volumeSlider.addEventListener("mousedown", volumeMouseHandler);
		volumeSlider.addEventListener("mousemove", volumeMouseHandler);

		const timestampWrapper = document.createElement("AV-TIMESTAMP-WRAPPER");
		controlsWrapperLeft.appendChild(timestampWrapper);

		const timestamp = document.createElement("AV-TIMESTAMP");
		timestampWrapper.appendChild(timestamp);

		const duration = document.createElement("AV-DURATION");
		timestampWrapper.appendChild(duration);

		timestamp.innerText = secondsToTimestamp(0);
		duration.innerText = secondsToTimestamp(video.duration);

		function seekbarUpdate(){
			const curPos = (video.currentTime/video.duration);
			seekbarMark.style.width = (curPos*100.0)+"%";
			timestamp.innerText = secondsToTimestamp(video.currentTime);
		}

		video.addEventListener('timeupdate',seekbarUpdate);
		video.addEventListener('durationchange', () => {
			duration.innerText= secondsToTimestamp(video.duration);
		});

		function seekbarHandler(e){
			if(e.buttons === 0){return;}
			const rect = seekbar.getBoundingClientRect();
			const curPos = Math.min(1,(e.x-rect.x)/rect.width);
			seekbarMark.style.width = (curPos*100.0)+"%";
			video.currentTime = (curPos*video.duration)|0;
			seekbarUpdate();
		}
		seekbar.addEventListener("mousedown", seekbarHandler);
		seekbar.addEventListener("mousemove", seekbarHandler);
	}

	function initAllVideos() {
		const getVideos = document.querySelectorAll('video');
		for (const video of getVideos){
			initVideo(video);
		}
	}
	setTimeout(initAllVideos,0);
})();
