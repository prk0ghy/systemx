/* global configuration,PhotoSwipe,PhotoSwipeUI_Default,getFirstParentSection,showModal,fileExtension,downloadData */

(() => {
	const showInLightbox = (single,title) => {
		const pswpElement = document.getElementById("pswp");
		const imgTag = single.querySelector("img");
		const src    = imgTag.getAttribute("src");
		const w      = imgTag.naturalWidth|0;
		const h      = imgTag.naturalHeight|0;
		const items  = [{src,w,h,title}];

		const options = {
			index:0,
			bgOpacity: configuration.galleryBackgroundOpacity,
			closeOnScroll: false,
			shareEl: false,
			getThumbBoundsFn:()=>{
				const rect = imgTag.getBoundingClientRect();
				const ret = {
					x: rect.x|0,
					y:(rect.y|0) + (document.children[0].scrollTop),
					w:rect.width|0
				};
				return ret;
			}
		};
		const gal = new PhotoSwipe(pswpElement,PhotoSwipeUI_Default,items,options);
		gal.init();
	};

	const initExerciseFiles = () => {
		const wrappers = document.querySelectorAll("exercise-files");
		for (const wrapper of wrappers) {
			const uid = 'exercise_files_' + getFirstParentSection(wrapper).getAttribute("content-type-id");
			const fileList = document.createElement("EXERCISE-FILE-LIST");
			wrapper.appendChild(fileList);

			const fileRenderImage = (obj,i) => {
				return `<exercise-file file-type="image" file-index="${i}">
					<exercise-file-image><img src="${obj.content}"/></exercise-file-image>
					<exercise-file-name>${obj.name}</exercise-file-name>
					<exercise-file-delete></exercise-file-delete>
				</exercise-file>`;
			};

			const fileRenderMisc = (obj,i) => {
				return `<exercise-file file-type="misc" file-index="${i}">
					<exercise-file-placeholder>${fileExtension(obj.name)}</exercise-file-placeholder>
					<exercise-file-name>${obj.name}</exercise-file-name>
					<exercise-file-delete></exercise-file-delete>
				</exercise-file>`;
			};

			const fileDownloadIndex = async i => {
				const file = await fileGet(i);
				if(file === null){return;}
				downloadData(file.name,file.content);
			};

			const fileDeleteIndex = async i => {
				const data = await fileGetAll();
				data.files = data.files.filter((f,fi) => fi !== i);
				await fileSetAll(data);
				fileRenderAll(data);
			};

			const fileRender = (obj,i) => {
				const mimeSplit = obj.type.split("/");
				switch(mimeSplit[0]){
				default:
					return fileRenderMisc(obj,i);
				case "image":
					return fileRenderImage(obj,i);
				}
			};

			const fileSetAll = async newData => {
				localStorage.setItem(uid,JSON.stringify(newData));
			};

			const fileGetAll = async () => {
				const lsraw = localStorage.getItem(uid);
				return lsraw ? JSON.parse(lsraw) : {uid, files:[]};
			};

			const fileGet = async i => {
				const data = await fileGetAll();
				if((i < 0) || (i > data.files.length)){return null;}
				return data.files[i];
			};

			const fileRenderAll = async data => {
				const fileData = data || await fileGetAll();
				fileList.innerHTML = fileData.files.map(fileRender).join("");
				for(const img of fileList.querySelectorAll("exercise-file-image")){
					img.addEventListener("click",async () => {
						const i = img.parentElement.getAttribute("file-index")|0;
						const obj = await fileGet(i);
						showInLightbox(img,obj.name);
					});
				}
				for(const but of fileList.querySelectorAll("exercise-file-delete")){
					const i = but.parentElement.getAttribute("file-index")|0;
					but.addEventListener("click",() => fileDeleteIndex(i));
				}
				for(const but of fileList.querySelectorAll("exercise-file-name,exercise-file-placeholder")){
					const i = but.parentElement.getAttribute("file-index")|0;
					but.addEventListener("click",() => fileDownloadIndex(i));
				}
				fileList.setAttribute("max-cols",fileData.files.length > 2 ? 2 : 1);
			};

			const fileLoad = file => new Promise((resolve,reject) => {
				const obj = {
					name: file.name,
					type: file.type
				};
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					obj.content = reader.result;
					resolve(obj);
				}, false);
				reader.addEventListener("error", e => reject(e));
				reader.addEventListener("abort", e => reject(e));
				reader.readAsDataURL(file);
			});

			const fileSave = async obj => {
				try {
					const data = await fileGetAll();
					data.files.push(obj);
					await fileSetAll(data);
					fileRenderAll(data);
				} catch(e) {
					showModal(`<h3>Fehler</h3><p>Leider konnte die ausgew&auml;hlte Datei nicht gespeichert werden, eventuell ist Sie zu gro&szlig;.</p>`);
				}
			};

			const fileUpload = async file => {
				fileSave(await fileLoad(file));
			};

			const fileInput = document.createElement("INPUT");
			fileInput.setAttribute("type", "file");
			fileInput.setAttribute("multiple", "multiple");
			fileInput.addEventListener("change", () => {
				for(const file of fileInput.files){
					fileUpload(file);
				}
			});
			wrapper.appendChild(fileInput);

			const uploadButton = document.createElement("EXERCISE-UPLOAD-BUTTON");
			uploadButton.innerText = "Datei hochladen";
			wrapper.appendChild(uploadButton);
			uploadButton.addEventListener("click", e => {
				e.preventDefault();
				fileInput.click();
			});

			setTimeout(fileRenderAll,0);
		}
	};
	setTimeout(initExerciseFiles, 0);
})();
