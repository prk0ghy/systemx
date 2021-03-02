/* global showModal */

function initBoxes() {
	const boxes = document.querySelectorAll(".box");
	boxes.forEach(box => {
		const boxDetails = box.firstElementChild;
		const boxHeader  = boxDetails.querySelector("summary");
		const boxContent = boxDetails.querySelector(".box-content");
		boxHeader.addEventListener("click", e => {
			e.preventDefault();
			boxDetails.setAttribute("open", "");
			boxDetails.offsetTop; // Sync CSS <-> JS
			showModal(boxContent);
		});
	});
}
setTimeout(initBoxes, 0);
