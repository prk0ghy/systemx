/* global hideOverlay,showOverlay,overlayCloseHandlers */

(()=>{
	let hideHelpVideoCallback = undefined;

	function initHelpVideo(videoWrap){
		const videoSrc = videoWrap.getAttribute("video");
		const button = videoWrap.querySelector("help-video-button");
		let video = undefined;
		let classRemoverTimer = undefined;
		let oldX, oldY;

		function hideHelpVideo(){
			videoWrap.removeAttribute("open");
			videoWrap.style.transition = "left 600ms, top 400ms, width 500ms, height 500ms";
			videoWrap.style.left       = oldX+30+"px";
			videoWrap.style.top        = oldY+"px";
			videoWrap.style.width      = "2em";
			videoWrap.style.height     = "2em";
			video.style.opacity = 0;
			video.offsetTop;
			videoWrap.offsetTop;

			hideHelpVideoCallback = undefined;
			if(classRemoverTimer === undefined){
				classRemoverTimer = setTimeout(() => {
					videoWrap.classList.remove("active");
					videoWrap.removeAttribute("style");
					classRemoverTimer = undefined;
					video.style.display = "none";
				},610);
			}
		}

		function showHelpVideo(){
			if(hideHelpVideoCallback !== undefined){
				hideOverlay();
				return;
			}
			if(video === undefined){
				video = document.createElement("VIDEO");
				video.setAttribute("src",videoSrc);
				video.setAttribute("muted","muted");
				videoWrap.append(video);
				video.addEventListener("ended",hideOverlay);
				video.addEventListener("click",hideOverlay);
			}
			video.style.display = "block";
			video.style.width = (window.innerWidth|0)+"px";
			video.style.height = (window.innerHeight|0)+"px";
			video.currentTime = 0;
			video.play();
			video.style.opacity = 1;
			video.offsetTop;

			const rect = videoWrap.getBoundingClientRect();
			oldX = (rect.left|0);
			oldY = (rect.top|0);
			videoWrap.style.left = oldX+"px";
			videoWrap.style.top  = oldY+"px";
			videoWrap.offsetTop;

			videoWrap.setAttribute("open","open");
			videoWrap.classList.add("active");
			videoWrap.style.transition = "left 400ms, top 250ms, width 1200ms, height 1200ms";
			videoWrap.style.left       = (window.innerWidth/2)+"px";
			videoWrap.style.top        = (window.innerHeight/2)+"px";

			const max = Math.max(window.innerWidth*2,window.innerHeight*2);
			videoWrap.style.width  = max+"px";
			videoWrap.style.height = max+"px";
			videoWrap.offsetTop;

			showOverlay();
			hideHelpVideoCallback = hideHelpVideo;
			if(classRemoverTimer !== undefined){
				clearTimeout(classRemoverTimer);
				classRemoverTimer = undefined;
			}
		}

		button.addEventListener("click",(e) => {
			e.stopPropagation();
			showHelpVideo();
		});
		videoWrap.addEventListener("click",() => {
			hideOverlay();
		});

	}

	function initHelpVideos(){
		const videos = document.querySelectorAll("help-video");

		for(const video of videos){
			initHelpVideo(video);
		}
	}

	function hideCurHelpVIdeo(){
		if(hideHelpVideoCallback === undefined){return;}
		hideHelpVideoCallback();
	}

	overlayCloseHandlers.push(hideCurHelpVIdeo);
	setTimeout(initHelpVideos,0);
})();
