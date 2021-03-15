/* Don't pollute the global scope if avoidable */
(() => {
	function initRights() {
		const licenseButtons = document.querySelectorAll("details.license > summary");
		licenseButtons.forEach((license) => {
			license.parentElement.setAttribute("open","");
			license.addEventListener('click',(e) => {
				e.preventDefault();
				license.parentElement.classList.toggle("active");
				e.stopPropagation();
			});
		});
	}
	setTimeout(initRights, 0);
})();
