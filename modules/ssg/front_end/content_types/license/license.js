/* Don't pollute the global scope if avoidable */
(() => {
	const initRights = () => {
		const licenseButtons = document.querySelectorAll("details.license > summary");
		for(const license of licenseButtons){
			const licenseContent = license.parentElement.lastElementChild;
			if((licenseContent === null) || (licenseContent.innerHTML.trim().length === 0)){
				license.classList.add("missing-attribution");
			}
			license.parentElement.setAttribute("open","");
			license.addEventListener('click',(e) => {
				e.preventDefault();
				e.stopPropagation();
				license.parentElement.classList.toggle("active");
			});
		}
	};
	setTimeout(initRights, 0);
})();
