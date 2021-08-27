/* globals showModal,showEmbeddingSections */

(() => {
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

	const initGlossaryLink = a => {
		a.classList.add("glossary-link");
		a.addEventListener("click",async (e) => {
			e.preventDefault();
			const href  = getLinkPath(a.href);
			const entry = document.querySelector(`glossary-entry[entry-href="${href}"]`);
			const modal = entry === null ? await loadGlossaryEntry(a.href) : showModal(entry);
			showEmbeddingSections(modal.querySelector("modal-content"));
		});
	};

	const initGlossary = () => {
		for(const link of document.querySelectorAll("a")){
			const hrefArr = link.href.split("/");
			if(hrefArr.length < 5){continue;}
			if(hrefArr[3] !== "glossar"){continue;}
			initGlossaryLink(link);
		}
	};
	setTimeout(initGlossary,0);
})();
