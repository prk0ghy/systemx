(() => {
	function initTabboxes() {
		const boxes = document.querySelectorAll(".tabbox");
		boxes.forEach(box => {
			const innerContent = box.firstElementChild;
			let headerHtml  = '';
			let contentHtml = '';
			let i = 1;
			for(const tab of innerContent.children){
				const tabHeader = tab.firstElementChild;
				const tabContent = tab.lastElementChild;
				let curClass = '';
				if(i === 1){curClass = ' active';}
				headerHtml += `<div class="tabbox-header${curClass}" tab-index="${i}">${tabHeader.innerHTML}</div>`;
				contentHtml += `<div class="tabbox-content${curClass}" tab-index="${i}">${tabContent.outerHTML}</div>`;
				i++;
			}
			innerContent.innerHTML = `<div class="tabbox-wrap"><div class="tabbox-header-wrap">${headerHtml}</div>
				<div class="tabbox-content-wrap">${contentHtml}</div></div>`;

			const tabHeader  = innerContent.querySelectorAll(".tabbox-header");
			const tabContent = innerContent.querySelectorAll(".tabbox-content");

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
				});
			}));
		});
	}
	setTimeout(initTabboxes, 0);
})();

