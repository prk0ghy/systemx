/* globals showEmbedSections */

(() => {
	function initTabboxes() {
		const boxes = document.querySelectorAll('section[content-type="tabbox"]');
		boxes.forEach(box => {
			const innerContent = box.firstElementChild;
			const tabHeader  = innerContent.querySelectorAll(".tabbox-header");
			const tabContent = innerContent.querySelectorAll(".tabbox-content");
			showEmbedSections(innerContent.querySelector(".tabbox-content.active"));

			tabHeader.forEach((header => {
				const curIndex = header.getAttribute('tab-index') | 0;
				if(curIndex === 0){return;}
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
					showEmbedSections(curContent);
				});
			}));
		});
	}
	setTimeout(initTabboxes, 0);
})();

