/* globals showModal */

(() => {
	function getLinkPath(href){
		return "/"+(String(href).split("/").slice(3).join("/"));
	}

	async function loadGlossarEntry(rawHref){
		let glossarHTML = `<section content-type="error"><inner-content><h3>Der Glossareintrag konnte nicht geladen werden</h3></inner-content></section>`;
		try {
			const getGlossar = await fetch(rawHref);
			if(getGlossar.ok){
				const parser       = new DOMParser();
				const htmlDocument = parser.parseFromString(await getGlossar.text(), "text/html");
				const main         = htmlDocument.documentElement.querySelector("main");
				if(main !== null){
					glossarHTML = main.innerHTML;
				}
			}
		} catch(e){}

		const glossarEntry = document.createElement("GLOSSAR-ENTRY");
		glossarEntry.setAttribute("entry-href",getLinkPath(rawHref));
		glossarEntry.innerHTML = `<glossar-entry-content>${glossarHTML}</glossar-entry-content>`;
		document.querySelector("main").appendChild(glossarEntry);
		showModal(glossarEntry);
	}

	function initGlossarLink(a){
		a.classList.add("glossar-link");
		a.addEventListener("click",async (e) => {
			e.preventDefault();
			const href  = getLinkPath(a.href);
			const entry = document.querySelector(`glossar-entry[entry-href="${href}"]`);
			if(entry !== null){ // Just show the entry if it is already loaded, otherwise load it
				showModal(entry);
			}else{
				loadGlossarEntry(a.href);
			}
		});
	}

	function initGlossar() {
		const getGlossars = document.querySelectorAll("a");
		for(const glossar of getGlossars){
			const hrefArr = glossar.href.split("/");
			if(hrefArr.length < 5){continue;}
			if(hrefArr[3] !== "glossar"){continue;}
			initGlossarLink(glossar);
		}
	}
	setTimeout(initGlossar,0);
})();
