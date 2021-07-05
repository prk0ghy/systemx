(() => {
	if (!window.postMessage || !window.addEventListener || window.h5pResizerInitialized) {return;}
	window.h5pResizerInitialized = true;

	const actionHandlers = {};
	actionHandlers.hello = (iframe, data, respond) => {
		iframe.style.width = '100%';
		iframe.getBoundingClientRect();
		const resize = function() {
			if (iframe.contentWindow) {
				respond('resize');
			} else {
				window.removeEventListener('resize', resize);
			}
		};
		window.addEventListener('resize', resize, false);
		respond('hello');
	};

	actionHandlers.prepareResize = (iframe, data, respond) => {
		if (iframe.clientHeight !== data.scrollHeight || data.scrollHeight !== data.clientHeight) {
			iframe.style.height = data.clientHeight + 'px';
			respond('resizePrepared');
		}
	};

	actionHandlers.resize = (iframe, data) => {
		iframe.style.height = data.scrollHeight + 'px';
	};

	window.addEventListener('message', event => {
		if (event.data.context !== 'h5p') {
			return;
		}
		let iframe;
		const iframes = document.getElementsByTagName('iframe');
		for (let i = 0; i < iframes.length; i++) {
			if (iframes[i].contentWindow === event.source) {
				iframe = iframes[i];
				break;
			}
		}
		if (!iframe) {return;}
		if (actionHandlers[event.data.action]) {
			actionHandlers[event.data.action](iframe, event.data, (action, data) => {
				data = data === undefined ? {} : data;
				data.action = action;
				data.context = 'h5p';
				event.source.postMessage(data, event.origin);
			});
		}
	}, false);
})();
