(()=>{
	function decodeParam(g){
		return decodeURIComponent(g).replace(/\+/g,' ');
	}

	function getParamValue(key, href){
		const params = href ? href.split('?') : window.location.search.split('?');
		if(params.length !== 2){
			return '';
		}
		const split = params[1].split('&');
		for (let i = 0; i < split.length; i++) {
			const item = split[i].split('=');
			if (item[0] === key) { return decodeParam(item[1]); }
			if (item[0] === encodeURIComponent(key)) { return decodeParam(item[1]); }
		}
		return '';
	}

	function ytCalcStart(t){
		let ret = 0;
		const m   = t.match(/(\d+[a-z])/g);

		for(let i=0;i<m.length;i++){
			const cstr = String(m[i]);
			const unit = cstr.charAt(cstr.length-1).toLowerCase();
			const count = (cstr.substr(0,cstr.length-1))|0;
			if(unit === 's'){
				ret += count;
			}
			if(unit === 'm'){
				ret += count*60;
			}
			if(unit === 'h'){
				ret += count*3600;
			}
		}
		return ret;
	}

	function vimeoToIframe(href,autoplay){
		const m = href.match(/https?:\/\/vimeo.com\/(\d+)/i);
		if(m === null){return null;}
		const vid = m[1];
		const ret = document.createElement("IFRAME");
		ret.setAttribute("src",`https://player.vimeo.com/video/${vid}${autoplay ? "?autoplay=1" : ""}`);
		return ret;
	}

	function youtubeToIframe(href,autoplay){
		const m = href.match(/https?:\/\/www.youtube.com\/watch?.*/i);
		if(m === null){return vimeoToIframe(href,autoplay);}
		const vid = getParamValue('v',href);
		const params = [];
		const time = getParamValue('t',href)|0;
		if(autoplay){
			params.push('autoplay=1');
		}
		if(time > 0){
			params.push('start='+ytCalcStart(time));
		}
		const ret = document.createElement("IFRAME");
		ret.setAttribute("src",`https://www.youtube-nocookie.com/embed/${vid}${params.length > 0 ? "?"+params.join('&') : ""}`);
		return ret;
	}

	function tagesschauToIFrame(href, autoplay){
		const m = href.match(/https?:\/\/www.tagesschau.de\/multimedia\/video\/video-(\d+).*/i);
		if(m === null){return youtubeToIframe(href,autoplay);}
		const vid = m[1];
		const ret = document.createElement("IFRAME");
		ret.setAttribute("src",`https://www.tagesschau.de/multimedia/video/video-${vid}~player_branded-true.html`);
		return ret;
	}

	function textToEmbedding(href,autoplay){
		if(autoplay === undefined){autoplay = false;}
		if(href === undefined){return false;}
		const ret = tagesschauToIFrame(href,autoplay);
		if(ret !== null){
			ret.setAttribute('width',"870");
			ret.setAttribute('height',"490");
			ret.setAttribute('frameborder',"0");
			ret.setAttribute("allow","autoplay; fullscreen");
		}
		return ret;
	}

	function initEmbeddingLinks(){
		const embeddingLinks = document.querySelectorAll(".embedding-link");
		addHideElementContentHandler("hideIframes",ele => {
			for(const e of ele.querySelectorAll('iframe-wrap[iframe-type="youtube"]')){
				e.remove();
			}
			for(const e of ele.querySelectorAll(".hidden-yt-placeholder")){
				e.classList.remove('hidden-yt-placeholder');
			}
		});
		for(const link of embeddingLinks){
			link.setAttribute("embedding-target","youtube"); // Should actually check the href in the future
			link.addEventListener("click",(e) => {
				const embeddingIframe = textToEmbedding(link.href,true);
				if(embeddingIframe !== null){
					e.preventDefault();
					const wrap = document.createElement("IFRAME-WRAP");
					wrap.setAttribute("iframe-type","youtube");
					wrap.append(embeddingIframe);
					link.parentElement.insertBefore(wrap,link);
					embeddingIframe.classList.add("yt-iframe");
					link.classList.add("hidden-yt-placeholder");
				}
			});

		}
	}
	setTimeout(initEmbeddingLinks,0);
})();
