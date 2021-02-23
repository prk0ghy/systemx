function initNavigation(){
	const navBar = document.querySelector('body > aside');
	const navButton = document.querySelector('#button-navigation');
	
	navButton.addEventListener('click',(e) => {
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
setTimeout(initNavigation,0);
