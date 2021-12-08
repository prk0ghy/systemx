/* global showOverlay,hideOverlay,overlayCloseHandlers,showEmbeddingSections,hideElementContentHandler,getFirstParentSection */
let overlayHideBoxCallback = undefined;

/* Don't pollute the global scope if avoidable */
(() => {
	const initBoxes = () => {
		const boxes = document.querySelectorAll('section[content-type="box"] > inner-content > details');
		boxes.forEach(boxDetails => {
			boxDetails.classList.add("box-wrap");
			const boxSection = getFirstParentSection(boxDetails);
			const boxHeader  = boxDetails.querySelector("summary");
			const boxContent = boxDetails.querySelector("box-content");
			let boxVisible = false;
			let classRemoverTimer = undefined;

			const calcHeights = () => {
				if(boxVisible){
					const viewportHeight = window.innerHeight|0;
					const headerHeight   = boxHeader.clientHeight|0;
					boxContent.style.maxHeight = (viewportHeight - headerHeight - 80) + "px"; // 80 == padding
				}else{
					boxContent.style.maxHeight = "";
				}
			};

			const showBox = () => {
				boxVisible = true;
				const rect = boxHeader.getBoundingClientRect();
				boxDetails.parentElement.style.height = ((rect.height|0)+8) + "px"; // Set a fixed height for the parent element, because as soon as we set position:fixed it will loose its height and would lead to content jumping aronud
				const oldTop = (rect.top|0);
				const newTop = window.innerWidth > 800 ? 32 : 16;
				const diff = oldTop - newTop;
				boxDetails.style.top = `${newTop}px`;
				boxDetails.style.transform = `translateY(${diff}px)`;
				boxDetails.classList.add("active");
				boxDetails.getBoundingClientRect(); // Sync CSS <-> JS
				boxDetails.style.transition = `transform 250ms`;
				window.requestAnimationFrame(() => {
					boxDetails.style.transform = `translateY(0)`;
				});
				showEmbeddingSections(boxContent);

				showOverlay(boxSection);
				overlayHideBoxCallback = hideBox;
				if(classRemoverTimer !== undefined){
					clearTimeout(classRemoverTimer);
					classRemoverTimer = undefined;
				}
				calcHeights();
			};

			const hideBox = () => {
				boxDetails.classList.add("closing");
				boxVisible = false;
				overlayHideBoxCallback = undefined;
				if(classRemoverTimer === undefined){
					classRemoverTimer = setTimeout(() => {
						boxDetails.classList.remove("closing");
						boxDetails.classList.remove("active");
						classRemoverTimer = undefined;
						boxDetails.parentElement.style.height = "";
						boxDetails.setAttribute("style","");
					},410);
				}
				hideElementContentHandler(boxDetails);
				const prect = boxDetails.parentElement.getBoundingClientRect();
				const newTop = window.innerWidth > 800 ? 32 : 16;
				boxDetails.style.transform = `translateY(${(prect.top - newTop)|0}px)`;
				calcHeights();
			};

			boxHeader.addEventListener("click", e => {
				e.preventDefault();
				boxDetails.setAttribute("open", "");
				boxDetails.offsetTop; // Sync CSS <-> JS
				if(boxVisible){
					hideOverlay();
				}else{
					showBox();
				}
			});
		});

		const hideCurBox = () => {
			if(overlayHideBoxCallback === undefined){return;}
			overlayHideBoxCallback();
		};
		overlayCloseHandlers.push(hideCurBox);
	};
	setTimeout(initBoxes, 0);
})();
