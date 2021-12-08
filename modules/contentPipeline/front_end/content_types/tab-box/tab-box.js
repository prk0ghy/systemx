/* globals showEmbeddingSections,hideElementContentHandler */
(() => {
	const initTabBoxes = () => {
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
					tabContent.forEach((cContent)=>{cContent.classList.remove('active'); hideElementContentHandler(cContent);});
					header.classList.add('active');
					curContent.classList.add('active');
					showEmbeddingSections(curContent);
					getCurrentTab();
				});
			}));

			const nextButton     = innerContent.querySelector("next-tab");
			const previousButton = innerContent.querySelector("previous-tab");

			nextButton.addEventListener('click',() => {
				const nextTab = getCurrentTab() + 1;
				setTab(nextTab);
				tabHeader[0].scrollIntoView(true);
				window.scrollBy(0, -64);
			});

			previousButton.addEventListener('click',() => {
				const previousButton = getCurrentTab() - 1;
				setTab(previousButton);
				tabHeader[0].scrollIntoView(true);
				window.scrollBy(0, -64);
			});

			const removeAllActiveTabs = () => {
				tabHeader.forEach((header => {
					header.classList.remove("active");
				}));
				tabContent.forEach((content => {
					content.classList.remove("active");
				}));
			};

			const getCurrentTab = () => {
				let index = -1;
				for (let k = 0; k < tabHeader.length; k++) {
					if (tabHeader[k].classList.contains("active")) {
						index = k;
					}
				}
				return index;
			};

			const setTab = i => {
				if (i<0){ i = tabHeader.length -1;}
				if (i>(tabHeader.length -1)){ i = 0;}
				removeAllActiveTabs();
				tabHeader[i].classList.add('active');
				tabContent[i].classList.add('active');
				showEmbeddingSections(tabContent[i]);
			};
		});
	};
	setTimeout(initTabBoxes, 0);
})();
