/* globals Quill,getFirstParentSection */


(() => {
	const initExerciseEditors = () => {
		const textareas = document.querySelectorAll(".exercise-text");
		for (const area of textareas) {
			const section = getFirstParentSection(area);
			const id = section !== null ? section.getAttribute("content-type-id") : "undefined";
			const localStorageKey = `quill-${id}`;
			const fancyEditor = document.createElement("FANCY-EXERCISE-EDITOR");
			area.parentElement.append(fancyEditor);
			area.parentElement.removeChild(area);
			const icons = Quill.import('ui/icons');
			icons.bold = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.23 21.47"><path d="M16.92 12.89a5.75 5.75 0 00-2.4-3.19 9.45 9.45 0 00.65-1.14 5.93 5.93 0 00-.37-5.74A6 6 0 009.69 0H0v21.47h11.15a5.91 5.91 0 005.67-4 7.6 7.6 0 00.1-4.58zM3 3h6.69a3 3 0 012.58 1.43 2.91 2.91 0 01.19 2.84 2.63 2.63 0 01-2.34 1.4L3 8.73zm11 13.56a2.93 2.93 0 01-2.82 1.91H3v-6.74h8.16a3 3 0 012.86 2 4.61 4.61 0 01-.02 2.83z" fill="#444"/></svg>';
			icons.italic = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.81 21.47"><path fill="#444" d="M14.81 0v3h-4.64L7.68 18.47h4.16v3H0v-3h4.64L7.13 3H2.97V0h11.84z"/></svg>';
			icons.underline = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.29 26.21"><g data-name="Ebene 2"><g data-name="Ebene 4" fill="#444"><path d="M21.79 0v12.24a9.15 9.15 0 01-18.29 0V0h3v12.24a6.15 6.15 0 0012.29 0V0zM0 24.71h25.29M0 23.21h25.29v3H0z"/></g></g></svg>';
			icons.strike = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.86 21.59"><path fill="#444" d="M.32 14.21L0 12.24 28.54 7.5l.32 1.97L.32 14.21zM8.19 6.25A2.05 2.05 0 018.7 4.5c1-1.07 3.14-1.61 5.94-1.48 4.73.23 6.21 3.56 6.27 3.7l1.33-.55 1.45-.59C23.6 5.36 21.49.35 14.78 0 10-.21 7.61 1.24 6.47 2.49A5 5 0 007.32 10l5.58-.93c-2.33-.44-4.5-1.41-4.71-2.82zM20.59 15.47a1.68 1.68 0 01-.34 1.53c-.92 1.11-3.22 1.7-6.13 1.55-4.74-.2-6.22-3.55-6.27-3.66l-1.36.55-1.42.56c.09.22 2.2 5.23 8.9 5.55h1c3.49 0 6.17-.93 7.6-2.66a4.66 4.66 0 001-4.15 5.7 5.7 0 00-1.9-3.09l-5.37.89c2.56.54 3.94 1.46 4.29 2.93z"/><path d="M20.39 10.86l-7.66 1.23h.18l7.51-1.25z" fill="#444"/></svg>';
			icons.color = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.28 26.23"><path d="M13.8 0h-2.31L1.54 19.41l1.33.68 1.34.69.35-.69 2.22-4.32H18.5l2.22 4.32.35.69 1.34-.69 1.33-.68zM8.31 12.77l4.33-8.44L17 12.77z" fill="#444"/><path fill="#a4a4a4" d="M0 23.23h25.28v3H0z"/></svg>';
			icons.background = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="12 11 26.7 26"><defs><clipPath id="prefix__clip-path" transform="translate(12.25 11.3)"><path class="prefix__cls-fill-none" fill="none" d="M0 0h26.23v26.23H0z"/></clipPath><style>.prefix__cls-1{fill:#444}</style></defs><g clip-path="url(#prefix__clip-path)"><path class="prefix__cls-1" d="M-.007 25.96L25.958-.003l.707.707L.7 26.668zM3.438 29.4L29.403 3.437l.707.707L4.145 30.108zM6.88 32.84l.7.71 9.8-9.8 1.48-2.9L6.88 32.84zM33.55 7.58l-.71-.7-5.37 5.37.48.93 5.6-5.6zM19.5 28.37l-.12.27-.02.02.14-.29zM13.73 32.86l-3.42 3.42.71.71 3.65-3.65-.86-.44-.08-.04zM23.15 23.44l-.47.93h.96l2.92-2.92-.48-.94-2.93 2.93zM36.99 11.02l-.71-.71-6.48 6.48.48.94 6.71-6.71zM40.42 14.46l-.7-.71-7.59 7.59.48.93 7.81-7.81zM13.75 39.72l.71.7 11.05-11.05H24.1L13.75 39.72zM17.19 43.16l.71.7 13.32-13.32-.48-.93-13.55 13.55zM43.86 17.9l-.7-.71-8.7 8.7.48.93 8.92-8.92zM47.3 21.33l-.71-.7-9.8 9.8.48.94L47.3 21.33zM34.26 34.27l-.9.46-.29-.58-12.44 12.44.7.71 13.15-13.15-.22.12zM24.073 50.03l25.965-25.964.707.707L24.78 50.738zM29.7 25.37h-.18l.12-.12.06.12z"/><path class="prefix__cls-1" d="M36.04 31.18l-1.85-3.62-.48-.94-1.85-3.6-.48-.94-1.85-3.61-.48-.93-1.8-3.61-.48-.95-.2-.38h-2.32l-4.57 8.84L14.25 32l.21.12.94.48.18.09 1.34.68.33-.68 2.07-4 .15-.29h11.78l.26.48.48.94 1.48 2.9.35.68h.1l1.24-.64 1.33-.69zm-15-5.81l4.33-8.44 1.46 2.84.48.92 1.84 3.61.48.94.06.12z"/></g></svg>';
			icons.list.ordered = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.83 22.75"><path fill="#444" d="M5.91 1.35h17.92v3H5.91zM5.91 9.9h17.92v3H5.91zM5.91 18.4h17.92v3H5.91zM2.82.57v4.56a.53.53 0 01-.58.57.53.53 0 01-.57-.57V1.78L1.42 2a.6.6 0 01-.34.18A.51.51 0 01.66 2a.56.56 0 01-.17-.41.6.6 0 01.19-.39l1-1a.78.78 0 01.61-.2.51.51 0 01.53.57zM4.19 13.68a.53.53 0 01-.57.57H.75a.53.53 0 01-.58-.57 2.29 2.29 0 01.19-1A2.11 2.11 0 01.83 12a3.55 3.55 0 01.58-.46l.59-.31.71-.41a1.67 1.67 0 00.36-.3.49.49 0 00.09-.3c0-.33-.07-.42-.09-.44s-.11-.08-.44-.08h-.87a1 1 0 00-.41.06.26.26 0 00-.09.18.71.71 0 01-.17.36.54.54 0 01-.42.16.57.57 0 01-.42-.16.51.51 0 01-.14-.45 1.47 1.47 0 01.52-1 1.85 1.85 0 011.13-.32h.82A1.7 1.7 0 013.83 9a1.7 1.7 0 01.42 1.25 1.54 1.54 0 01-.27.92 2.59 2.59 0 01-.66.61l-.8.48-.52.31a2.07 2.07 0 00-.41.36.71.71 0 00-.12.18h2.2a.53.53 0 01.52.57zM4.36 21a1.78 1.78 0 01-.44 1.3 1.79 1.79 0 01-1.31.44h-.87a1.83 1.83 0 01-1.19-.34 1.47 1.47 0 01-.54-1 .55.55 0 01.13-.46.62.62 0 01.43-.16.55.55 0 01.58.54.34.34 0 00.12.23 1.15 1.15 0 00.47.07h.87a.83.83 0 00.5-.1s.1-.14.1-.49-.07-.46-.1-.49a.83.83 0 00-.5-.1H2a.58.58 0 010-1.15h.9c.07 0 .09 0 .11-.07a1.19 1.19 0 00.08-.48c0-.34-.07-.43-.09-.44s-.11-.09-.44-.09h-.74a1 1 0 00-.41.06.26.26 0 00-.1.19.56.56 0 01-.58.54.58.58 0 01-.43-.17.51.51 0 01-.12-.46 1.41 1.41 0 01.52-1 1.8 1.8 0 011.12-.31h.74a1.7 1.7 0 011.25.42 1.7 1.7 0 01.42 1.25 1.59 1.59 0 01-.28 1 1.15 1.15 0 01.26.41 2.33 2.33 0 01.15.86z"/></svg>';
			icons.list.bullet = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.88 20.05"><path fill="#444" d="M4.96 0h17.92v3H4.96zM4.96 8.56h17.92v3H4.96zM4.96 17.05h17.92v3H4.96z"/><circle cx="1.35" cy="1.5" r="1.35" fill="#444"/><circle cx="1.35" cy="10.06" r="1.35" fill="#444"/><circle cx="1.35" cy="18.61" r="1.35" fill="#444"/></svg>';
			const editor = new Quill(fancyEditor, {
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'], // toggled buttons
						[{
							'color': []
						}, {
							'background': []
						}], // dropdown with defaults from theme
						[{
							'list': 'ordered'
						}, {
							'list': 'bullet'
						}]
					]
				},
				theme: 'snow',
				placeholder: 'Aufgabe bearbeiten'
			});
			let delayedWriteHandle = undefined;
			editor.on('text-change', () => {
				if (delayedWriteHandle) {
					clearTimeout(delayedWriteHandle);
					delayedWriteHandle = undefined;
				}
				delayedWriteHandle = setTimeout(() => {
					delayedWriteHandle = undefined;
					const contentJSON = JSON.stringify(editor.getContents());
					localStorage.setItem(localStorageKey, contentJSON);
				}, 200); // Only write to localStorage after 200ms of inactivity
				//change underline of QL Picker with actual color
				const pickerLabel = document.querySelector(".ql-color-picker .ql-picker-label");
				const pickerSvg = pickerLabel.querySelector("svg path:last-child");
				const colorValue = pickerLabel.dataset.value;
				if (colorValue !== null) {
					pickerSvg.style.fill = pickerLabel.dataset.value;
				}
			});

			const colorPalletteSelector = document.querySelectorAll("span.ql-picker-item");

			for (let i = 0; i < colorPalletteSelector.length; i++) {
				colorPalletteSelector[i].addEventListener("click", () => {
					//change underline of QL Picker with actual color
					const pickerColor = document.querySelector(".ql-color .ql-picker-label");
					const pickerSvg = pickerColor.querySelector("svg path:last-child");
					const colorValue = pickerColor.dataset.value;

					if (colorValue !== undefined) {
						pickerSvg.style.fill = pickerColor.dataset.value;
					}
					else {
						pickerSvg.style.fill = "#000000";
					}

					//change Background of QL Picker with actual color
					const pickerBackground = document.querySelector(".ql-background .ql-picker-label");
					const pickerSvgBg = pickerBackground.querySelector("svg");
					const colorValueBg = pickerBackground.dataset.value;

					if (colorValueBg !== undefined) {
						pickerSvgBg.style.backgroundColor = pickerBackground.dataset.value;
					}
					else {
						pickerSvgBg.style.backgroundColor = "transparent";
					}
				});
			}

			const loadedContentJSON = localStorage.getItem(localStorageKey);
			if (loadedContentJSON !== null) {
				try {
					const loadedContent = JSON.parse(loadedContentJSON);
					editor.setContents(loadedContent);
				} catch (e) {
					localStorage.removeItem(localStorageKey);
				}
			}
		}
	};

	const initUploadSections = () => {
		const sections = document.querySelectorAll("upload-section");
		for (const section of sections) {
			const uploadButton = document.createElement("UPLOAD-BUTTON");
			uploadButton.innerText = "Datei hochladen";
			section.appendChild(uploadButton);

			const fileInput = document.createElement("INPUT");
			fileInput.setAttribute("type", "file");
			section.appendChild(fileInput);

			uploadButton.addEventListener("click", (e) => {
				e.preventDefault();
				fileInput.click();
			});
		}
	};
	setTimeout(initExerciseEditors, 0);
	setTimeout(initUploadSections, 0);
})();
