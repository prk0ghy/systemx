
(()=>{
	function initFigureRows(){
		const rows = document.querySelectorAll("figure-row");
		for(const row of rows){
			const cols = row.children;
			const ratios = [];
			for(const col of cols){
				const img = col.querySelector("img");
				if(!img){break;}
				const width = img.getAttribute("width")|0;
				const height = img.getAttribute("height")|0;
				if((width <= 0) || (height <= 0)){break;}
				ratios.push(width/height);
			}
			if(ratios.length !== cols.length){continue;}
			const sum = ratios.reduce((a,b) => a+b,0);
			const widths = ratios.map(v => (v/sum) * 100.0);
			widths.forEach((v,i) => {cols[i].style.width = `${v}%`;});
			console.log(widths);
		}
	}
	setTimeout(initFigureRows,0);
})();
