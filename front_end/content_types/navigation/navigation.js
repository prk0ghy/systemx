/* global showOverlay,hideOverlay,overlayCloseHandlers */

function initNavBar() {
	const navBar = document.querySelector("body > aside");
	const navButton = document.querySelector("#button-navigation");

	const navCloseButton = document.createElement("NAV-CLOSE-BUTTON");
	navBar.append(navCloseButton);
	navCloseButton.addEventListener("click", () => {
		navBar.classList.remove("active");
		hideOverlay();
	});

	navButton.addEventListener("click", () => {
		if (navBar.classList.contains("active")) {
			navBar.classList.remove("active");
			hideOverlay();
		} else {
			navBar.classList.add("active");
			showOverlay();
		}
	});
	overlayCloseHandlers.push(() => {
		navBar.classList.remove("active");
	});
}
setTimeout(initNavBar, 0);

/* Don't pollute the global scope if avoidable */
(() => {
	function initNavigation() {
		const navUl = document.querySelectorAll("nav > ul ul");

		function showNavigationActive(ele){
			if((ele == null) || ((ele.tagName !== "UL") && (ele.tagName !== "LI"))){return;}
			if(ele.tagName === "UL"){
				ele.classList.remove("hidden");
			}else{
				ele.firstChild.classList.add("active");
			}
			showNavigationActive(ele.parentElement);
		}

		function refreshNavigationList(){
			for(ele of document.querySelectorAll("nav ul")){
				ele.classList.add("hidden");
			}
			for(ele of document.querySelectorAll("nav-toggle.active")){
				ele.classList.remove("active");
			}
			showNavigationActive(document.querySelector("nav li.active"));
		}


		navUl.forEach(ele => {
			const parentLi = ele.parentElement;
			const toggle = document.createElement("NAV-TOGGLE");
			parentLi.prepend(toggle);

			toggle.addEventListener("click", () => {
				if(ele.classList.contains("hidden")){
					ele.classList.remove("hidden");
					toggle.classList.add("active");
				} else {
					ele.classList.add("hidden");
					toggle.classList.remove("active");
				}
			});
		});
		refreshNavigationList();


		overlayCloseHandlers.push(() => {
			refreshNavigationList();
		});
	}
	setTimeout(initNavigation, 0);
})();
