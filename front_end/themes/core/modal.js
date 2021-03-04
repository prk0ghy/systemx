/* exported showModal,hideModal */
/* global showOverlay,hideOverlay,overlayCloseHandlers */

function showModal(content) {
	content.classList.add("show-modal");
	content.oddsetTop; // Sync CSS <-> JS
	content.classList.add("visible");
	content.firstElementChild.focus();
	if(content.querySelector(".close-modal") === null){
		const buttonCloseModal = document.createElement("div");
		buttonCloseModal.classList.add("close-modal");
		buttonCloseModal.addEventListener("click",hideOverlay);
		content.prepend(buttonCloseModal);
	}
	showOverlay();
}

function hideModal() {
	const modals = document.querySelectorAll(".show-modal.visible");
	modals.forEach(modal => {
		modal.classList.remove("visible");
		setTimeout(() => {
			const parent = modal.parentElement;
			if (parent.tagName === "DETAILS") {
				parent.removeAttribute("open");
			}
			modal.classList.remove("show-modal");
		}, 310);
	});
}

/* Don't pollute the global scope if avoidable */
(() => {
	function initModal(){
		overlayCloseHandlers.push(hideModal);
	}
	setTimeout(initModal, 0);
})();
