/* global hideOverlay,showOverlay,overlayCloseHandlers,getFirstParentSection */

(()=>{
	// This var stores a reference to a hideHelpVideo() function
	// if a helpVideo is currently active. This is necessary
	// because the references to the elements are only visible
	// in the scope of initHelpVideo. Will be ignored if undefined
	let hideHelpVideoCallback = undefined;

	const initHelpVideo = videoWrap => {
		const section  = getFirstParentSection(videoWrap);
		const videoSrc = videoWrap.getAttribute("video");
		const button   = videoWrap.querySelector("help-video-button");
		let video      = undefined;
		let oldX, oldY;

		const hideHelpVideo = () => {
			videoWrap.removeAttribute("open");
			videoWrap.style.transition = "left 600ms, top 400ms, width 500ms, height 500ms";
			videoWrap.style.left       = `calc(${oldX}px + 1em)`;
			videoWrap.style.top        = oldY+"px";
			videoWrap.style.width      = "2em";
			videoWrap.style.height     = "2em";
			videoWrap.offsetTop;
			video.style.opacity = 0;
			video.offsetTop;
			if(video.playing){video.stop();}

			hideHelpVideoCallback = undefined;
		};

		const showHelpVideo = () => {
			// This is so clicking on the button again while it is opening close it again
			if(hideHelpVideoCallback !== undefined){
				hideOverlay();
				return;
			}
			// Create the Video element on demand
			if(video === undefined){
				video = document.createElement("VIDEO");
				video.setAttribute("src",videoSrc);
				video.muted = "muted";
				video.volume = 0;
				videoWrap.append(video);
				video.addEventListener("ended",() => {
					if(video.currentTime < (video.duration-1)){return;}
					hideOverlay();
				});
				video.addEventListener("click",hideOverlay);
			}
			const max = Math.min(window.innerWidth,window.innerHeight) * 0.86;
			// Set widht/height on every call, because the viewport size might have changed
			video.style.display = "block";
			video.style.width   = max*0.79+"px";
			video.style.height  = max*0.79+"px";
			video.style.opacity = 1;
			video.currentTime   = 0;
			video.play();
			video.offsetTop;

			// Calculate screen position for button and set those before we set the transition propoerty
			// This is so the button starts moving from its old position, and we hide that we switch its
			// Position from absolute to fixed
			const rect = videoWrap.getBoundingClientRect();
			oldX = (rect.left|0);
			oldY = (rect.top|0);
			videoWrap.style.left = oldX+"px";
			videoWrap.style.top  = oldY+"px";
			videoWrap.offsetTop;

			// The open attribute is used for animation purposes, while the active class sticks around
			// a while longer and is mostly used for setting z-index/display.
			videoWrap.setAttribute("open","open");
			videoWrap.classList.add("active");
			videoWrap.style.transition = "left 400ms, top 250ms, width 650ms, height 650ms";
			videoWrap.style.left       = ((document.body.clientWidth/2)|0)+"px";
			videoWrap.style.top        = ((window.innerHeight/2)|0)+"px";

			// We animate the size to a circle of max(width,height)*2, that way it should fill the screen
			// and while animating always stay circular.
			videoWrap.style.width  = max+"px";
			videoWrap.style.height = max+"px";
			videoWrap.offsetTop;

			showOverlay(section);
			hideHelpVideoCallback = hideHelpVideo;
		};

		button.addEventListener("click",(e) => {
			e.stopPropagation();
			showHelpVideo();
		});
		videoWrap.addEventListener("click",() => {
			hideOverlay();
		});
		videoWrap.addEventListener("transitionend",(e) => {
			// left has the longest transition, so we only care for this property
			if(e.propertyName !== "left")              {return;}
			// Also, we only want to remove classes when we are hiding the video
			if(videoWrap.getAttribute("open") !== null){return;}
			videoWrap.classList.remove("active");
			videoWrap.removeAttribute("style");
			video.style.display = "none";
		});
	};

	const initHelpVideos = () => {
		const videos = document.querySelectorAll("help-video");

		for(const video of videos){
			initHelpVideo(video);
		}
	};

	const hideCurHelpVIdeo = () => {
		if(hideHelpVideoCallback === undefined){return;}
		hideHelpVideoCallback();
	};

	overlayCloseHandlers.push(hideCurHelpVIdeo);
	setTimeout(initHelpVideos,0);
})();
