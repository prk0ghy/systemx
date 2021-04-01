/* globals Quill */

function getFirstParentSection(ele){
	if(!ele){return null;}
	if(ele.tagName === 'SECTION'){return ele;}
	return getFirstParentSection(ele.parentElement);
}

(() => {
	function initTaskEditors(){
		const textareas = document.querySelectorAll(".tasktext");
		for(const area of textareas){
			const section = getFirstParentSection(area);
			const id = section !== null ? section.id : "undefined";
			const localStorageKey = `quill-${id}`;
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
						[{ 'list': 'ordered'}, { 'list': 'bullet' }]
					]
				},
				theme: 'snow'
			});
			let delayedWriteHandle = undefined;
			editor.on('text-change', () => {
				if(delayedWriteHandle){
					clearTimeout(delayedWriteHandle);
					delayedWriteHandle = undefined;
				}
				delayedWriteHandle = setTimeout(() => {
					delayedWriteHandle = undefined;
					const contentJSON = JSON.stringify(editor.getContents());
					localStorage.setItem(localStorageKey,contentJSON);
				},200); // Only write to localStorage after 200ms of inactivity
			});

			const loadedContentJSON = localStorage.getItem(localStorageKey);
			if(loadedContentJSON !== null){
				try {
					const loadedContent = JSON.parse(loadedContentJSON);
					editor.setContents(loadedContent);
				} catch(e) {
					localStorage.removeItem(localStorageKey);
				}
			}
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
			});
		}
	}
	setTimeout(initTaskEditors,0);
	setTimeout(initUploadSections,0);
})();
