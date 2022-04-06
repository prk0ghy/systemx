/* eslint-disable no-unused-vars */
/* globals scrollToElement */
(() => {
	const C_PROPERTY_KEY = "star-selection";
	const C_FOR_SECTION_KEY = "for-star";
	const C_VALID_STAR_MODES = ["stern", "true"];

	/**
	 * @param {HTMLElement} element
	 * @returns {boolean}
	 */
	const isStarMode = (element) => {
		return C_VALID_STAR_MODES.includes(element.getAttribute(C_PROPERTY_KEY));
	};

	/**
 	 * The top-offset used to scroll to star sections
     */
	const C_SCROLL_OFFSET = 150;
	let sectionIdCounter = 0;
	/** @type {Element[]} */
	let sections = [];
	const initStarSelection = () => {
		sections = Array.from(document.querySelectorAll("main>section"));
		const sectionsWithStars = [];
		// find all sections without the property 'star-selection'
		// who have sibling elements with the property
		for (const section of sections) {
			if (isStarMode(section)) {
				continue;
			}
			let nextSib = section.nextElementSibling;
			const starElements = [];
			// find siblings star element sibling
			while(
				nextSib !== null
				&& isStarMode(nextSib)
			) {
				starElements.push(nextSib);
				nextSib = nextSib.nextElementSibling;
			}
			if (starElements.length > 0) {
				sectionsWithStars.push({
					section,
					starElements
				});
			}
		}

		for(const {section, starElements} of sectionsWithStars) {
			// mark section to have star siblings
			section.setAttribute("with-stars", starElements.length);
			section.id = sectionIdCounter++;
			// remove markers from star elements
			for (const starElement of starElements) {
				const markers = Array.from(starElement.querySelectorAll("inner-content > a.marker"));
				const marker = markers.pop();
				if (marker) {
					marker.remove();
				}
				// mark the section as a star element sibling for the parent section
				starElement.setAttribute(C_FOR_SECTION_KEY, section.id);
			}

			const hasHelpVideo = section.querySelectorAll("inner-content > help-video").length > 0;
			const starButton = createStarButton();
			const container = document.createElement("div");
			container.classList.add("star-button-container");
			if (hasHelpVideo) {
				container.classList.add("offset");
			}
			container.appendChild(starButton);
			const starButtons = createStarButtons(starElements, section);
			starButtons.forEach(s => {
				container.appendChild(s);
			});
			let isOpen = false;
			//setVisibility(section, "visible");
			starButton.onclick = () => {
				//first reset all star buttons and star elements
				isOpen = !isOpen;
				starButtons.forEach(s => {
					s.classList.toggle("shift-in");
					setVisibility(s, isOpen ? "visible" : "hidden");
				});
				if (!isOpen) {
					resetStarElements(starElements);
					// if the section is hidden, add a fade animation
					if (!isVisible(section)) {
						//because fade in is an animation now, we just want to apply it to the star-selection elements
						if (section.getAttribute("star-selection")) {
							section.classList.add("fadein");
						}
					}
					starButton.classList.remove("open");
				} else {
					starButton.classList.add("open");
					section.classList.remove("unblur");
					resetStarElements(starElements);
				}
				if (isOpen) {
					starButton.classList.add("open");
				} else {
					starButton.classList.remove("open");
				}
			};
			section.firstElementChild.appendChild(container);
		}
	};

	setTimeout(initStarSelection, 0);

	/**
	 *
	 * @returns {HTMLAnchorElement}
	 */
	const createStarButton = () => {
		const icon = document.createElement("a");
		icon.classList.add("bubble", "star");
		const img = document.createElement("img");
		img.setAttribute("title", "Zusatzinfos");
		icon.appendChild(img);
		return icon;
	};

	/**
	 * @param {string} icon
	 * @param {string} title
	 * @param {string} title
	 * @returns
	 */
	const getImage = (icon, title) => `<img title="${title}" src="/resources/svg/star-${icon}.svg" />`;

	/**
	 * @param {Element[]} starElements
	 * @param {Element} section
	 * @returns {Element[]}
	 */
	const createStarButtons = (starElements, section) => {
		return starElements.map(starElement => {
			const a =  document.createElement("a");
			let ct = starElement.getAttribute("content-type");
			// we need to differ the embed-ct between h5p and video
			if (ct === "embedding") {
				ct = starElement.getAttribute("embedding-type");
			}
			a.setAttribute("content-type", ct);
			a.classList.add("bubble");
			a.style.visibility = "hidden";
			const {icon, title } = getIconFromContentType(isImage(starElement) ? "image" : ct);
			a.innerHTML = getImage(icon, title);
			a.setAttribute("title", title);
			a.onclick = () => {
				// reset all other star elements
				starElements.filter(se => !se.isSameNode(starElement)).forEach(se => {
					se.classList.remove("star-active");
					se.style.top = null;
				});
				// also reset all star-buttons
				if (starElement.classList.contains("star-active")) {
					return;
				} else {
					starElement.classList.add("fadein");
					starElement.classList.add("star-active");
					// check for mobile resolution
					const margin = isMobile()? 0 : 68;
					console.log(margin);
					starElement.style.top = `-${section.offsetHeight + margin}px`;
					// we want the difference from section and star element, so the star elements dont overlap
					starElement.style.marginBottom = `-${section.offsetHeight + margin}px`;
					scrollToElement(section, C_SCROLL_OFFSET);
					// we need to dispatch a resize event, if the star-element is an embed
					if (starElement.getAttribute("embedding-type") === "h5p") {
						//somehow the event needs to be triggered with some delay or else it wont work fully
						setTimeout(() => {
							window.dispatchEvent(new Event("resize"));
						}, 20);
						//and we need to apply the new height to the margin-bottom again, but ww also need to wait for the browser
						setTimeout(() => {
							starElement.style.marginBottom = `-${section.offsetHeight + margin}px`;
						}, 100);
					}
				}
			};
			return a;
		});
	};

	/**
	 * @param {Element} element
	 * @param {"visible" | "hidden"} visibility
	 */
	const setVisibility  = (element, visibility) => {
		element.style.visibility = visibility;
	};

	/**
	 * @param {Element} element
	 * @returns
	 */
	const isVisible = (element) => element.style.visibility === "visible";

	/**
	 * @param {Element[]} starElements
	 */
	const resetStarElements = (starElements) => {
		starElements.forEach(starElement => {
			starElement.classList.remove("star-active");
			starElement.style.top = null;
			starElement.classList.remove("unblur", "blur");
		});
	};

	/**
	 * Determine if a 'text-and-image' section should use the image or text icon.
	 * If the section contains a div with the 'text-content', text icon will be used.
	 * If doens't contain text and contains figures or figure-rows it will use the
	 * image icon.
	 * @param {Element} element
	 * @returns true if the element should use the image icon, false otherwise.
	 */
	const isImage = (element) => {
		const ct = element.getAttribute("content-type");
		if (ct !== "text-image") {
			return false;
		}
		const hasText = element.querySelectorAll("inner-content > .text-content").length > 0;
		if (hasText) {
			return true;
		}
		const hasFigures = element.querySelectorAll("inner-content > figure").length > 0;
		const hasFigureRows = element.querySelectorAll("inner-content > figure-row").length > 0;
		const hasImages = hasFigureRows || hasFigures;
		return hasImages;
	};

	/**
	 * @param {string} contentType
	 * @returns
	 */
	const getIconFromContentType = contentType => {
		let title = "";
		let icon = "";
		switch(contentType) {
		case "text-and-image" :
			icon = "text";
			title = "Text / Bild";
			break;
		case "h5p" :
			icon = "quest";
			title = "Interaktion";
			break;
		case "video":
			icon = "video";
			title = "Video";
			break;
		case "audio":
			icon = "audio";
			title = "Audio";
			break;
		case "image": {
			icon = "image";
			title = "Bild(er)";
			break;
		}
		case "gallery": {
			icon = "image";
			title = "Bild(er)";
			break;
		}
		default:
			icon = "??";
			break;
		}
		return {
			icon,
			title
		};
	};

	const isMobile = () => {
		return window.innerWidth <= 820;
	};
})();
