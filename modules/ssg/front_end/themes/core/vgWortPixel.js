/* globals vgWortPixel */

(() => {
	const vgWortIsAllowed = () => {
		return true;
	};

	const initVgWortPixel = async () => {
		if(!vgWortIsAllowed())  {return;}
		if(vgWortPixel === null){return;}
		if(vgWortPixel === "")  {return;}
		await fetch(vgWortPixel, {cache: "no-store"});
	};
	setTimeout(initVgWortPixel,0);
})();
