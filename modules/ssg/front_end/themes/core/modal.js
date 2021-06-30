/* exported showModal,hideModal */
/* global showOverlay,hideOverlay,overlayCloseHandlers */

const showModal = content => {
	content.classList.add("show-modal");
	content.offsetTop; // Sync CSS <-> JS
	content.classList.add("visible");
	if(content.querySelector("MODAL-CLOSE") === null){ // Only add a new button of there currently is no button
		const buttonCloseModal = document.createElement("MODAL-CLOSE");
		buttonCloseModal.classList.add("MODAL-CLOSE");
		buttonCloseModal.addEventListener("click",hideOverlay);
		content.prepend(buttonCloseModal);
	}
	showOverlay();
};

const hideModal = () => {
	const modals = document.querySelectorAll(".show-modal.visible");
	modals.forEach(modal => {
		modal.classList.remove("visible");
		setTimeout(() => {
			const parent = modal.parentElement;
			if (parent.tagName === "DETAILS") {
				parent.removeAttribute("open");
			}
			modal.classList.remove("show-modal");
		}, 510);
	});
};

setTimeout(() => {
	overlayCloseHandlers.push(hideModal);
}, 0);

