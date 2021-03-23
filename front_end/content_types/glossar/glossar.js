(() => {
	function initGlossarLink(a){
		console.log(a);
		a.addEventListener("click",(e) => {
			e.preventDefault();
			showModal(a);
		});
	}

	function initGlossar(){
		const getGlossars = document.querySelectorAll("a");
		for(const glossar of getGlossars){
			const hrefArr = glossar.href.split("/");
			if(hrefArr.length < 5){continue;}
			if(hrefArr[3] !== "glossar"){continue;}
			initGlossarLink(glossar);
		}
	}
	setTimeout(initGlossar,0);
})();