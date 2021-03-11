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
						['bold', 'italic', 'underline', 'strike'],        // toggled buttons
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						[{ 'header': [1, 2, false] }],
						[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
					  ]
				},
				theme: 'snow'
			});
		})
	}
	setTimeout(initTaskEditors,0);
})();