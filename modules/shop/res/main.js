/* global baseUrl */

const postData= async (url = '', data = {}) => {
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
};

const cartAddProduct = (product,amount = 1) => {
	postData(baseUrl+'/cart',{
		"verb":"add",
		"product":product,
		"amount":amount
	});
};

const cartRemoveProduct = product => {
	postData(baseUrl+'/cart',{
		"verb":"remove",
		"product":product
	});
};

const initProductLinks = () => {
	const cbs = document.querySelectorAll('input[type="checkbox"][value="orderItem"]');
	for(let i=0;i<cbs.length;i++){
		const cb = cbs[i];
		cb.addEventListener('change', () => {
			const product = String(cb.name);
			if(cb.checked){
				cartAddProduct(product);
			}else{
				cartRemoveProduct(product);
			}
		});
	}
};

const initCartActions = () => {
	const cbs = document.querySelectorAll('cart-remove');
	for(let i=0;i<cbs.length;i++){
		const cb = cbs[i];
		cb.addEventListener('click', () => {
			const product = String(cb.getAttribute('product-id'));
			cartRemoveProduct(product);
			const li = cb.parentNode;
			li.classList.add('removing');
			setTimeout(() => {
				li.parentNode.removeChild(li);
			},500);
		});
	}
};

const closeSideNav = () => {
	const overlay = document.querySelector('.userpanel-overlay');
	overlay.addEventListener('click', e => {
		const sidenav = document.querySelector('.userpanel-container');
		sidenav.classList.remove('active');
		e.target.classList.remove('active');
		setTimeout(() => {
			e.target.style.display='none';
		}, 500);
	});
};

const toggleSideNav = () => {
	const overlay = document.querySelector('.userpanel-overlay');
	setTimeout(() => {
		overlay.classList.toggle('active');
	}, 1);
	overlay.classList.toggle('active');
	const btn_open = document.querySelector('#nav-right .open-nav');
	btn_open.addEventListener('click', () => {
		const sidenav = document.querySelector('.userpanel-container');
		const overlay = document.querySelector('.userpanel-overlay');
		sidenav.classList.toggle('active');
		setTimeout(() => {
			overlay.style.display='block';
		}, 1);
		setTimeout(() => {
			overlay.classList.toggle('active');
		}, 10);
	});
};
setTimeout(closeSideNav,0);
setTimeout(toggleSideNav,0);
setTimeout(initProductLinks,0);
setTimeout(initCartActions,0);
