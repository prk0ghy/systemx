/* globals showModal,showEmbeddingSections */

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

	const loadGlossaryEntry = async rawHref => {
		const content = await fetchGlossaryEntry(rawHref);
		const entry = document.createElement("GLOSSARY-ENTRY");
		entry.setAttribute("entry-href",getLinkPath(rawHref));
		entry.innerHTML = `<modal-content>${content}</modal-content>`;
		document.querySelector("main").appendChild(entry);
		return showModal(entry);
	};

	const glossaryClickHandler = async e => {
		e.preventDefault();
		const a = e.target;
		if(!a){return;}
		const href  = getLinkPath(a.href);
		const entry = document.querySelector(`glossary-entry[entry-href="${href}"]`);
		const modal = entry === null ? await loadGlossaryEntry(a.href) : showModal(entry);
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
