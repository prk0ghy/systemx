(() => {
	function getNumerator(type,i){
		switch(type){
		default:
			return String(i);
		case "a":
			return String.fromCharCode(97+i-1);
		case "A":
			return String.fromCharCode(65+i-1);
		}
	}

	function initOrderedLists() {
		const taskLists = document.querySelectorAll(".task-content ol");
		for(const list of taskLists){
			list.setAttribute("type","a");
		}

		const lists = document.querySelectorAll("main ol");
		for(const list of lists){
			const items = list.children;
			const start = list.getAttribute("start");
			const type  = list.getAttribute("type");
			const dir   = list.getAttribute("reversed") === null ? 1 : -1;
			const lType = type === null ? "1" : type;
			let i = start === null ? 1 : start | 0;

			for(const item of items){
				const numerator = document.createElement("div");
				numerator.classList.add("ol-numerator");
				const itemValue = item.getAttribute("value");
				if(itemValue !== null){i = itemValue | 0;}
				numerator.innerText = getNumerator(lType,i);
				i += dir;
				item.prepend(numerator);
			}
		}
	}
	setTimeout(initOrderedLists, 0);
})();
