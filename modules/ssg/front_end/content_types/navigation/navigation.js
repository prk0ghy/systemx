/* global showOverlay,hideOverlay,overlayCloseHandlers */

const initNavBar = () => {
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
};
setTimeout(initNavBar, 0);

/* Don't pollute the global scope if avoidable */
(() => {
	const initNavigation = () => {
		const navUl = document.querySelectorAll("nav > ul ul");

		const showNavigationActive = ele => {
			if((ele === null) || ((ele.tagName !== "UL") && (ele.tagName !== "LI"))){return;}
			if(ele.tagName === "UL"){
				ele.classList.remove("hidden");
			}else{
				ele.firstElementChild.classList.add("active");
			}
			for(const chi of ele.children){
				if(chi.tagName === "UL"){
					chi.classList.remove("hidden");
				}
			}
			showNavigationActive(ele.parentElement);
		};

		const refreshNavigationList = () => {
			for(const ele of document.querySelectorAll("nav ul")){
				ele.classList.add("hidden");
			}
			for(const ele of document.querySelectorAll("nav")){
				if(ele.firstElementChild){
					ele.firstElementChild.classList.remove("hidden");
				}
			}
			for(const ele of document.querySelectorAll("nav-toggle.active")){
				ele.classList.remove("active");
			}
			showNavigationActive(document.querySelector("nav li.active"));
		};

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

		//this opens the menu on Jura-Museum
		if (navUl.length < 50) {
			const firstLevel = document.querySelectorAll("nav > ul > li > ul > li");
			for (let i = 0; i < firstLevel.length; i++) {
				firstLevel[i].firstElementChild.classList.add("active");
				const ulHidden = firstLevel[i].querySelector("ul");
				if (ulHidden !== null) {
					ulHidden.classList.remove("hidden");
				}
			}
		}
	};
	setTimeout(initNavigation, 0);
})();
