(() => {

	function initVideo(video) {
		video.removeAttribute('controls');

		const wrapper = document.createElement("DIV");
		wrapper.classList.add("av-wrapper");
		video.parentElement.insertBefore(wrapper,video);
		wrapper.appendChild(video);

		const controlsWrapper = document.createElement("DIV");
		controlsWrapper.classList.add("av-control-wrapper");
		wrapper.appendChild(controlsWrapper);

		const playPauseButton = document.createElement("DIV");
		playPauseButton.classList.add("av-play-button");
		controlsWrapper.appendChild(playPauseButton);

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
	}

	function initAllVideos() {
		const getVideos = document.querySelectorAll('video');
		for (const video of getVideos){
			initVideo(video);
		}
	}
	setTimeout(initAllVideos,0);
})();
