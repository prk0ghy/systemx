/* globals vgWortPixel */

(() => {
	const vgWortIsAllowed = () => {
		return true;
	};

	const initVgWortPixel = async () => {
		if(!vgWortIsAllowed())  {return;}
		await fetch(vgWortPixel, {cache: "no-store"});
		//when we have the vgWortPixel, we add it to the DOM
		if (vgWortPixel) {
			const doc = new DOMParser().parseFromString(vgWortPixel,"text/html");
			const errorNode = doc.querySelector('parsererror');
			if (errorNode) {
				//do nothinig on Error, it should be handled in BE
			} else {
				const bodyTag = document.querySelector("body");
				const mainBody = document.querySelector("main");
				const hiddenImg = doc.querySelector("img");
				hiddenImg.style.display = "none";
				bodyTag.insertBefore(hiddenImg, mainBody);
			}
		}
	};
	if(window.vgWortPixel){
		setTimeout(initVgWortPixel,0);
	}
})();
