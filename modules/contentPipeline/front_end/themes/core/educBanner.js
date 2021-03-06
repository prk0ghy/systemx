/* exported canUseTeacher,iamTeacher,teacherTrue,continueWhenTeacher */
/* global hideOverlay,showModal,configuration */

const iamTeacher = async (v) => {
	if(v){
		localStorage.setItem('isTeacher', 'true');
		continuationsWaitingForIsTeacher.forEach(c => c());
	}else {
		localStorage.removeItem('isTeacher');
	}
};

const teacherTrue = () => localStorage.getItem('isTeacher') === 'true';

const continuationsWaitingForIsTeacher = [];
const continueWhenTeacher = () => new Promise(resolve => {
	continuationsWaitingForIsTeacher.push(resolve);
});

const canUseTeacher = () => new Promise(resolve => {
	if(teacherTrue()){ resolve(true); return; }
	hideOverlay();

	const modal = showModal(`<p style="text-align: right;">Hiermit bestätige ich, dass ich SchülerIn oder LehrerIn bin.</p>
		<div id="privacy-btn-wrap">
		<button button-type="accept">bestätigen</button>
		</div>`);
	const acceptButton = modal.querySelector(`button[button-type="accept"]`);
	acceptButton.addEventListener("click", async () => {
		await iamTeacher(true);
		hideOverlay();
		return resolve(true);
	});
	acceptButton.focus();
});

if (configuration.educBanner) {
	//somehow we only can start it  if everything is loaded
	window.addEventListener("load", canUseTeacher);
}
