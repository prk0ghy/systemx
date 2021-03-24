(() => {

	function initVideo(video) {
		video.removeAttribute('controls');

		const wrapper = document.createElement("AV-WRAP");
		video.parentElement.insertBefore(wrapper,video);
		wrapper.appendChild(video);

		const controlsWrapper = document.createElement("AV-CONTROLS");
		wrapper.appendChild(controlsWrapper);

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

		volumeButton.addEventListener("click", (e) => {
			e.preventDefault();
			if(!video.muted){
				volumeButton.classList.add('active');
				video.muted = true;
			} else{
				volumeButton.classList.remove('active');
				video.muted = false;
			}
		});


	}

	function initAllVideos() {
		const getVideos = document.querySelectorAll('video');
		for (const video of getVideos){
			initVideo(video);
		}
	}
	setTimeout(initAllVideos,0);
})();
