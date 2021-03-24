/* globals Quill */

(() => {
	function initTaskEditors(){
		const textareas = document.querySelectorAll(".tasktext");
		for(const area of textareas){
			const fancyEditor = document.createElement("DIV");
			fancyEditor.classList.add("fancy-task-editor");
			area.parentElement.append(fancyEditor);
			area.parentElement.removeChild(area);
			new Quill(fancyEditor,{
				modules: {
					toolbar: [
						[{ 'header': 1 }, { 'header': 2 }],               // custom button values
						['bold', 'italic', 'underline', 'strike'],        // toggled buttons
						[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
						[{ 'list': 'ordered'}, { 'list': 'bullet' }]
					]
				},
				theme: 'snow'
			});
		}
	}

	function initUploadSections(){
		const sections = document.querySelectorAll("upload-section");
		for(const section of sections){
			const uploadButton = document.createElement("UPLOAD-BUTTON");
			uploadButton.innerText = "Datei hochladen";
			section.appendChild(uploadButton);

			const fileInput = document.createElement("INPUT");
			fileInput.setAttribute("type","file");
			section.appendChild(fileInput);

			uploadButton.addEventListener("click",(e)=>{
				e.preventDefault();
				fileInput.click();
			})
		}
	}
	setTimeout(initTaskEditors,0);
	setTimeout(initUploadSections,0);
})();
