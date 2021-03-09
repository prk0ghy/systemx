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
						['blockquote', 'code-block'],

						[{ 'header': 1 }, { 'header': 2 }],               // custom button values
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
						[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
						[{ 'direction': 'rtl' }],                         // text direction

						[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
						[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

						[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
						[{ 'font': [] }],
						[{ 'align': [] }],

						['clean']                                         // remove formatting button
					  ]
				},
				theme: 'snow'
			});
		})
	}
	setTimeout(initTaskEditors,0);
})();