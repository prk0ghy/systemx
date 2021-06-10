/* globals showEmbeddingSections */

(() => {
	function initTabBoxes() {
		const boxes = document.querySelectorAll('section[content-type="tab-box"]');
		boxes.forEach(box => {
			const boxType = box.getAttribute('tab-box-type');
			if(boxType === "support"){return;}
			const innerContent = box.firstElementChild;
			const tabHeader  = innerContent.querySelectorAll("tab-box-header");
			const tabContent = innerContent.querySelectorAll("tab-box-content");
			showEmbeddingSections(innerContent.querySelector("tab-box-content.active"));

			tabHeader.forEach((header => {
				const curIndex = header.getAttribute('tab-index') | 0;
				let curContent;
				tabContent.forEach((cContent)=>{
					const curContentIndex = cContent.getAttribute('tab-index') | 0;
					if(curIndex !== curContentIndex){return;}
					curContent = cContent;
				});
				if(curContent === undefined){return;}
				header.addEventListener('click',() => {
					tabHeader.forEach((cHeader)=>{cHeader.classList.remove('active');});
					tabContent.forEach((cContent)=>{cContent.classList.remove('active');});
					header.classList.add('active');
					curContent.classList.add('active');
					showEmbeddingSections(curContent);
				});
			}));
		});
	}
	setTimeout(initTabBoxes, 0);
})();

