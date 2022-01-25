(() => {
	const getNumerator = (type,i) => {
		switch(type){
		default:
			return String(i);
		case "a":
			return String.fromCharCode(97+i-1); // 97 == a in ASCII
		case "A":
			return String.fromCharCode(65+i-1); // 65 == A in ASCII
		}
	};

	const initOrderedLists = () => {
		// Set all exercise OLs to use lower case alphabetical letters. might not be needed in the future
		for(const list of document.querySelectorAll(".exercise-content ol")){
			list.setAttribute("type","a");
		}

		// Set the second level of OL to the small Letter type
		for(const secondList of document.querySelectorAll("section[content-type=text-and-image] ol ol")) {
			secondList.setAttribute("type", "a");
		}

		// This should pretty much have the same functionality as normale OLs, only that we have
		// separate elements which help with styling
		for(const list of document.querySelectorAll("main ol")){
			const items = list.children;
			const start = list.getAttribute("start");
			const type  = list.getAttribute("type");
			const dir   = list.getAttribute("reversed") === null ? 1 : -1;
			const lType = type === null ? "1" : type;
			let i = start === null ? 1 : start | 0;

			for(const item of items){
				const numerator = document.createElement("OL-NUMBER");
				const itemValue = item.getAttribute("value");
				if(itemValue !== null){i = itemValue | 0;}
				numerator.innerText = getNumerator(lType,i);
				i += dir;
				item.prepend(numerator);
			}
		}
	};
	setTimeout(initOrderedLists, 0);
})();
