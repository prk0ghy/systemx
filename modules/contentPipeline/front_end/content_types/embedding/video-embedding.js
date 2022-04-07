/* global addHideElementContentHandler,canUseEmbeds, configuration */

(()=>{
	const decodeParam = g => {
		return decodeURIComponent(g).replace(/\+/g,' ');
	};

	const getParamValue = (key, href) => {
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
	};

	const ytCalcStart = t => {
		let ret = 0;
		const m   = t.match(/(\d+[a-z])/g);

		for(let i=0;i<m.length;i++){
			const cstr = String(m[i]);
			const unit = cstr.charAt(cstr.length-1).toLowerCase();
			const count = (cstr.substring(0,cstr.length-1))|0;
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
	};

	const embeddingHandlers = {};

	embeddingHandlers.vimeo = (href,autoplay) => {
		const m = href.match(/https?:\/\/vimeo.com\/(\d+)/i);
		if(m === null){return null;}
		const vid = m[1];
		return `https://player.vimeo.com/video/${vid}${autoplay ? "?autoplay=1" : ""}`;
	};

	embeddingHandlers.youtube = (href,autoplay) => {
		const m = href.match(/https?:\/\/www.youtube.com\/watch?.*/i);
		if(m === null){return null;}
		const vid = getParamValue('v',href);
		const params = [];
		const time = getParamValue('t',href)|0;
		const start = getParamValue('start', href);
		const end = getParamValue('end', href);
		if(autoplay){
			params.push('autoplay=1');
		}
		if(configuration.ytCaption) {
			params.push('cc_load_policy=1');
			params.push('cc_lang_pref=de');
		}
		if(time > 0){
			params.push('start='+ytCalcStart(time));
		}
		if (start > 0) {
			params.push('start=' + start);
		}
		if (end > 0) {
			params.push('end=' + end);
		}
		return `https://www.youtube-nocookie.com/embed/${vid}${params.length > 0 ? "?"+params.join('&') : ""}`;
	};

	embeddingHandlers.tagesschau = href => {
		const m = href.match(/https?:\/\/www.tagesschau.de\/multimedia\/video\/video-(\d+).*/i);
		if(m === null){return null;}
		const vid = m[1];
		return `https://www.tagesschau.de/multimedia/video/video-${vid}~player_branded-true.html`;
	};

	embeddingHandlers.arte = (href, autoplay) => {
		const m = href.match(/https?:\/\/www.arte.tv\/(de|fr|en|es|pl|it)\/videos\/([^/]*)\/*/); // could be more optimized
		if(m === null){return null;}
		if(autoplay === true){autoplay = 1;} else {autoplay = 0;}
		const lang = m[1];
		const id   = m[2];
		return `https://www.arte.tv/embeds/${lang}/${id}?autoplay=${autoplay}`;
	};

	const embeddingGetHref = (href, autoplay) => {
		for(const i in embeddingHandlers){
			const curHref = embeddingHandlers[i](href,autoplay);
			if(curHref !== null){return curHref;}
		}
		return null;
	};

	const textToEmbedding = (href,autoplay) => {
		if(autoplay === undefined){autoplay = false;}
		if(href === undefined){return null;}
		const embedHref = embeddingGetHref(href,autoplay);
		if(embedHref === null){return null;}
		const ret = document.createElement("IFRAME");
		ret.setAttribute("src", embedHref);
		ret.setAttribute('width',"870");
		ret.setAttribute('height',"490");
		ret.setAttribute('frameborder',"0");
		ret.setAttribute("allow","autoplay; fullscreen");
		return ret;
	};

	const initEmbeddingLinks = () => {
		const embeddingLinks = document.querySelectorAll(".embedding-link");
		addHideElementContentHandler("hideVideoEmbeddings",ele => {
			for(const e of ele.querySelectorAll('iframe-wrap[iframe-type="video"]')){
				e.remove();
			}
			for(const e of ele.querySelectorAll(".hidden-video-placeholder")){
				e.classList.remove('hidden-video-placeholder');
			}
		});
		for(const link of embeddingLinks){
			link.setAttribute("embedding-target","video");
			const embeddingIframe = textToEmbedding(link.href,true);
			if(embeddingIframe === null){continue;}
			link.addEventListener("click",async e => {
				e.preventDefault();
				if (await canUseEmbeds()) {
					const wrap = document.createElement("IFRAME-WRAP");
					wrap.setAttribute("iframe-type","video");
					wrap.append(embeddingIframe);
					link.parentElement.insertBefore(wrap,link);
					embeddingIframe.classList.add("video-iframe");
					link.classList.add("hidden-video-placeholder");
				}
			});
		}
	};
	setTimeout(initEmbeddingLinks,0);
})();
