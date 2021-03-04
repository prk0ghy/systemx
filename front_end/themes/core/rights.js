/* Don't pollute the global scope if avoidable */
(() => {
	function initRights() {
		const licenseButtons = document.querySelectorAll("details.license > summary");
		licenseButtons.forEach((license) => {
			license.parentElement.setAttribute("open","");
			license.addEventListener('click',(e) => {
				e.preventDefault();
				license.parentElement.classList.toggle("active");
			});
		});
	}
	setTimeout(initRights, 0);
})();
