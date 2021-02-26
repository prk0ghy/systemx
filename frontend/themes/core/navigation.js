/*global showOverlay,hideOverlay,overlayCloseHandler */

function initNavBar(){
	const navBar = document.querySelector('body > aside');
	const navButton = document.querySelector('#button-navigation');

	const navCloseButton = document.createElement("div");
	navCloseButton.id = "nav-close-button";
	navBar.append(navCloseButton);
	navCloseButton.addEventListener('click',()=>{
		navBar.classList.remove('active');
		hideOverlay();
	})

	navButton.addEventListener('click',() => {
		if(navBar.classList.contains('active')){
			navBar.classList.remove('active');
			hideOverlay();
		}else{
			navBar.classList.add('active');
			showOverlay();
		}
	});

	overlayCloseHandler.push(() => {
		navBar.classList.remove('active');
	})
}
setTimeout(initNavBar,0);

function initNavigation(){
	const navUl = document.querySelectorAll('nav > ul ul');
	navUl.forEach((ele) => {
		ele.classList.add('hidden');

		const parentLi = ele.parentElement;
		let toggle = document.createElement("div");
		toggle.classList.add('nav-toggle');
		parentLi.prepend(toggle);

		toggle.addEventListener('click',() => {
			ele.classList.toggle('hidden');
			toggle.classList.toggle('active');
		});
	});

	overlayCloseHandler.push(() => {
		navUl.forEach((ele) => {
			ele.classList.remove('hidden');
		});
	})
}
setTimeout(initNavigation,0);
