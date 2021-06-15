async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'same-origin',
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	});
	return response.json();
}

function cartAddProduct(product,amount){
	if(amount === undefined){amount = 1;}
	postData(baseUrl+'/cart',{
		"verb":"add",
		"product":product,
		"amount":amount
	});
}

function cartRemoveProduct(product,amount){
	if(amount === undefined){amount = 1;}
	postData(baseUrl+'/cart',{
		"verb":"remove",
		"product":product
	});
}

function cartEmptyAll(){
	postData(baseUrl+'/cart',{
		"verb":"empty"
	});
}

function initProductLinks(){
	var cbs = document.querySelectorAll('input[type="checkbox"][value="orderItem"]');
	for(var i=0;i<cbs.length;i++){
		let cb = cbs[i];
		cb.addEventListener('change', e => {
			let product = cb.name+"";
			if(cb.checked){
				cartAddProduct(product);
			}else{
				cartRemoveProduct(product);
			}
		})
	}
}


function initCartActions(){
	var cbs = document.querySelectorAll('cart-remove');
	for(var i=0;i<cbs.length;i++){
		let cb = cbs[i];
		cb.addEventListener('click', (e) => {
			let product = cb.getAttribute('product-id')+'';
			cartRemoveProduct(product);
			let li = cb.parentNode;
			li.classList.add('removing');
			setTimeout(function(){
				li.parentNode.removeChild(li);
			},500);
		})
	}
}

function closeSideNav(){
	let overlay = document.querySelector('.userpanel-overlay');
	overlay.addEventListener('click', function(e){
		let sidenav = document.querySelector('.userpanel-container');
		sidenav.classList.remove('active');
		e.target.classList.remove('active');
		setTimeout(function () {
			e.target.style.display='none';
		}, 500);
	});
};

function toggleSideNav(){
	let overlay = document.querySelector('.userpanel-overlay');
	setTimeout(function () {
		overlay.classList.toggle('active');
	}, 1);
	overlay.classList.toggle('active');
	let btn_open = document.querySelector('#nav-right .open-nav');
	btn_open.addEventListener('click', function(e){
		let sidenav = document.querySelector('.userpanel-container');
		let overlay = document.querySelector('.userpanel-overlay');
		sidenav.classList.toggle('active');
		setTimeout(function () {
			overlay.style.display='block';
		}, 1);
		setTimeout(function () {
			overlay.classList.toggle('active');
		}, 10);
	});
};
setTimeout(closeSideNav,0);
setTimeout(toggleSideNav,0);
setTimeout(initProductLinks,0);
setTimeout(initCartActions,0);
