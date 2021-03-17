(() => {
	function initTaskEditors(){
		const textareas = document.querySelectorAll(".tasktext");
		textareas.forEach(area => {
			const fancyEditor = document.createElement("DIV");
			fancyEditor.classList.add("fancy-task-editor");
			area.parentElement.append(fancyEditor);
			area.parentElement.removeChild(area);
			const editor = new Quill(fancyEditor,{
				modules: {
					toolbar: [
						[{ 'header': 1 }, { 'header': 2 }],               // custom button values
						['bold', 'italic', 'underline', 'strike'],        // toggled buttons
						[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
					  ]
				},
				theme: 'snow'
			});
		})
	}
	setTimeout(initTaskEditors,0);
})();