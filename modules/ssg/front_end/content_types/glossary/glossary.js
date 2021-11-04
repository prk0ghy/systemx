/* globals showEmbeddingSections */

const initGlossary = (() => {

	const getLinkPath = href => {
		return "/"+(String(href).split("/").slice(3).join("/"));
	};

	const fetchGlossaryEntry = async rawHref => {
		try {
			const getGlossar = await fetch(rawHref);
			if(getGlossar.ok){
				const parser       = new DOMParser();
				const htmlDocument = parser.parseFromString(await getGlossar.text(), "text/html");
				const main         = htmlDocument.documentElement.querySelector("main");
				if(main !== null){
					return main.innerHTML;
				}
			}
		} catch(e){ /* Doesn't matter */ }
		return `<section content-type="error"><inner-content><h3>Der Glossareintrag konnte nicht geladen werden</h3></inner-content></section>`;
	};

	const showGlossOverlay = (blurException) => {
		const overlayGlossElement = document.querySelector("PAGE-OVERLAY");
		overlayGlossElement.setAttribute("open","open");
		overlayGlossElement.classList.add("active");
		document.body.classList.add("modal-active");
		for(const child of document.querySelector("main").children){
			if(child === blurException){
				child.classList.remove("overlay-blur");
			}else{
				child.classList.add("overlay-blur");
			}
		}
	};

	const OpenGlossModal = (content) => {
		if (typeof content === 'string' || content instanceof String){
			const tempWrapper = document.createElement("TEMPORARY-MODAL");
			tempWrapper.innerHTML = `<modal-content>${content}</modal-content>`;
			document.body.append(tempWrapper);
			return OpenGlossModal(tempWrapper);
		}
		content.classList.add("show-modal");
		const storeBody = document.querySelector("body");
		storeBody.setAttribute("data-scroll", window.pageYOffset);
		const stored = parseInt(storeBody.dataset.scroll);
		storeBody.style.transform = "translateY(-" + stored +"px)";
		content.style.top = stored + window.innerHeight/2 + "px";

		// content.offsetTop; // Sync CSS <-> JS
		content.classList.add("visible");
		if(content.querySelector("MODAL-CLOSE") === null){ // Only add a new button of there currently is no button
			const buttonCloseModal = document.createElement("MODAL-CLOSE");
			buttonCloseModal.classList.add("MODAL-CLOSE");
			buttonCloseModal.addEventListener("click",CloseGlossModal);
			content.prepend(buttonCloseModal);
		}
		for(const child of document.querySelector("main").children){
			child.classList.remove("overlay-blur");
		}
		showGlossOverlay(content);
		return content;
	};

	const CloseGlossModal = () => {
		const overlayBody = document.querySelector("body");
		const overlayElement = document.querySelector("page-overlay");
		overlayBody.classList.remove("modal-active");
		overlayElement.removeAttribute("open");
		const modals = document.querySelectorAll(".show-modal.visible");
		overlayBody.style.transform = "translateY(0)";
		window.scrollTo(0, overlayBody.dataset.scroll);
		modals.forEach(modal => {
			modal.classList.remove("visible");
			setTimeout(() => {
				const parent = modal.parentElement;
				if (parent.tagName === "DETAILS") {
					parent.removeAttribute("open");
				}
				modal.classList.remove("show-modal");
				if(modal.tagName === "TEMPORARY-MODAL"){
					modal.remove();
				}
			}, 510);
		});
		for(const child of document.querySelector("main").children){
			child.classList.remove("overlay-blur");
		}
	};

	const loadGlossaryEntry = async rawHref => {
		const content = await fetchGlossaryEntry(rawHref);
		const entry = document.createElement("GLOSSARY-ENTRY");
		entry.setAttribute("entry-href",getLinkPath(rawHref));
		entry.innerHTML = `<modal-content>${content}</modal-content>`;
		document.querySelector("main").appendChild(entry);
		return OpenGlossModal(entry);
	};

	const glossaryClickHandler = async e => {
		e.preventDefault();
		const a = e.target;
		if(!a){return;}
		const href  = getLinkPath(a.href);
		const entry = document.querySelector(`glossary-entry[entry-href="${href}"]`);
		const modal = entry === null ? await loadGlossaryEntry(a.href) : OpenGlossModal(entry);
		setTimeout(initModalRights,0);
		showEmbeddingSections(modal.querySelector("modal-content"));
	};

	const initGlossaryLink = a => {
		a.classList.add("glossary-link");
		a.removeEventListener("click",glossaryClickHandler);
		a.addEventListener("click",glossaryClickHandler);
	};

	const isGlossaryHref = href => {
		const hrefArr = href.split("/");
		return hrefArr && (hrefArr.length > 4) && (hrefArr[3] === "glossar");
	};

	const initModalRights = () => {
		const licenseButtons = document.querySelectorAll("modal-content details.license > summary");
		for(const license of licenseButtons){
			const licenseContent = license.parentElement.lastElementChild;
			if((licenseContent === null) || (licenseContent.innerHTML.trim().length === 0)){
				license.classList.add("missing-attribution");
			}
			license.parentElement.setAttribute("open","");
			license.addEventListener('click', OpenLicenseModal);
		}
	};
	const OpenLicenseModal = e => {
		e.preventDefault();
		e.stopPropagation();
		e.target.parentElement.classList.toggle("active");
	};

	return () => {
		for(const link of document.querySelectorAll("a")){
			if(isGlossaryHref(link.href)){
				initGlossaryLink(link);
			}
		}
	};
})();
setTimeout(initGlossary,0);
