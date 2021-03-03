/* global showOverlay,hideOverlay,overlayCloseHandlers */

function initNavBar() {
	const navBar = document.querySelector("body > aside");
	const navButton = document.querySelector("#button-navigation");

	const navCloseButton = document.createElement("div");
	navCloseButton.id = "nav-close-button";
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

		function refreshNavigationList(){
			navUl.forEach(ele => {
				if(ele.parentElement.classList.contains("active")){
					ele.classList.remove("hidden");
				}else{
					ele.classList.add("hidden");
				}
			});
		}

		refreshNavigationList();
		navUl.forEach(ele => {
			const parentLi = ele.parentElement;
			const toggle = document.createElement("div");
			toggle.classList.add("nav-toggle");
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

		overlayCloseHandlers.push(() => {
			refreshNavigationList();
		});
	}
	setTimeout(initNavigation, 0);
})();
