/* global showOverlay,hideOverlay,overlayCloseHandlers,showEmbeddingSections */
let overlayHideBoxCallback = undefined;

/* Don't pollute the global scope if avoidable */
(() => {
	function initBoxes() {
		const boxes = document.querySelectorAll('section[content-type="box"] > inner-content > details');
		boxes.forEach(boxDetails => {
			boxDetails.classList.add("box-wrap");
			const boxHeader  = boxDetails.querySelector("summary");
			const boxContent = boxDetails.querySelector("box-content");
			let boxVisible = false;
			let classRemoverTimer = undefined;

			function calcHeights(){
				if(boxVisible){
					const viewportHeight = window.innerHeight|0;
					const headerHeight   = boxHeader.clientHeight|0;
					boxContent.style.maxHeight = (viewportHeight - headerHeight - 80) + "px"; // 80 == padding
				}else{
					boxContent.style.maxHeight = "";
				}
			}

			function showBox(){
				boxVisible = true;
				const rect = boxHeader.getBoundingClientRect();
				boxDetails.parentElement.style.height = ((rect.height|0)+8) + "px"; // Set a fixed height for the parent element, because as soon as we set position:fixed it will loose its height and would lead to content jumping aronud
				boxDetails.style.top = (rect.top|0) + "px";
				boxDetails.classList.add("active");
				boxDetails.getBoundingClientRect(); // Sync CSS <-> JS
				boxDetails.style.top = "32px";
				showEmbeddingSections(boxContent);

				showOverlay();
				overlayHideBoxCallback = hideBox;
				if(classRemoverTimer !== undefined){
					clearTimeout(classRemoverTimer);
					classRemoverTimer = undefined;
				}
				calcHeights();
			}

			function hideBox(){
				boxVisible = false;
				overlayHideBoxCallback = undefined;
				if(classRemoverTimer === undefined){
					classRemoverTimer = setTimeout(() => {
						boxDetails.classList.remove("active");
						classRemoverTimer = undefined;
						boxDetails.parentElement.style.height = "";
						boxDetails.style.top = "";
						boxContent.style.maxHeight = "";
					},410);
				}
				const prect = boxDetails.parentElement.getBoundingClientRect();
				boxDetails.style.top = (prect.top|0)+"px";
				calcHeights();
			}

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

		function hideCurBox(){
			if(overlayHideBoxCallback === undefined){return;}
			overlayHideBoxCallback();
		}
		overlayCloseHandlers.push(hideCurBox);
	}
	setTimeout(initBoxes, 0);
})();
