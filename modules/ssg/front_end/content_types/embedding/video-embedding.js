/* global addHideElementContentHandler showModal hideModal hideOverlay */

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
	};

	const vimeoToIframe = (href,autoplay) => {
		const m = href.match(/https?:\/\/vimeo.com\/(\d+)/i);
		if(m === null){return null;}
		const vid = m[1];
		const ret = document.createElement("IFRAME");
		ret.setAttribute("src",`https://player.vimeo.com/video/${vid}${autoplay ? "?autoplay=1" : ""}`);
		return ret;
	};

	const youtubeToIframe = (href,autoplay) => {
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
	};

	const tagesschauToIFrame = (href, autoplay) => {
		const m = href.match(/https?:\/\/www.tagesschau.de\/multimedia\/video\/video-(\d+).*/i);
		if(m === null){return youtubeToIframe(href,autoplay);}
		const vid = m[1];
		const ret = document.createElement("IFRAME");
		ret.setAttribute("src",`https://www.tagesschau.de/multimedia/video/video-${vid}~player_branded-true.html`);
		return ret;
	};

	const textToEmbedding = (href,autoplay) => {
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
	};

	const initEmbeddingLinks = () => {
		const embeddingLinks = document.querySelectorAll(".embedding-link");
		addHideElementContentHandler("hideIframes",ele => {
			for(const e of ele.querySelectorAll('iframe-wrap[iframe-type="video"]')){
				e.remove();
			}
			for(const e of ele.querySelectorAll(".hidden-video-placeholder")){
				e.classList.remove('hidden-video-placeholder');
			}
		});
		for(const link of embeddingLinks){
			link.setAttribute("embedding-target","video");
			link.addEventListener("click",(e) => {
				const embeddingIframe = textToEmbedding(link.href,true);
				if(embeddingIframe !== null){
					const getLocalStorage = localStorage.getItem('externalEmbeds');
					if (getLocalStorage === 'accept') {
						e.preventDefault();
						const wrap = document.createElement("IFRAME-WRAP");
						wrap.setAttribute("iframe-type","video");
						wrap.append(embeddingIframe);
						link.parentElement.insertBefore(wrap,link);
						embeddingIframe.classList.add("video-iframe");
						link.classList.add("hidden-video-placeholder");
					} else {
						e.preventDefault();
						privacyOverlay();
					}
				}
			});
		}
		const privacyOverlay = () => {
			const wrapper = document.createElement('div');
			wrapper.classList.add('privacy-overlay');
			const text = document.createElement('p');
			text.innerHTML = 'Fuer externe Embeds, benoetigen wir Ihre Zustimmung, eine Verbindung zu dem jeweiligem Anbieter aufzubauen';
			const learnMore = document.createElement('p');
			learnMore.innerHTML = 'In unserer <a href="./datenschutz">Datenschutzerklaerung</a> koennen Sie mehr dazu erfahren';
			const acceptButton = document.createElement('BUTTON');
			acceptButton.innerHTML = 'Akzeptieren';
			acceptButton.setAttribute('id', 'privacy-overlay-accept');
			wrapper.appendChild(text);
			wrapper.appendChild(learnMore);
			wrapper.appendChild(acceptButton);
			acceptButton.onclick = () => {
				localStorage.setItem('externalEmbeds', 'accept');
				hideModal();
				hideOverlay();
				wrapper.classList.add('hide');
			};
			document.body.appendChild(wrapper);
			showModal(wrapper);
		};
	};
	setTimeout(initEmbeddingLinks,0);
})();
