export default {
	queries: new Map([
		["inhaltsbausteine_heroimage_BlockType", {
			fetch: cms => `
				id
				images: bild {
					${cms.fragments.asset}
				}
			`,
			map: ({
				images,
				...rest
			}) => ({
				image: images[0],
				...rest
			})
		}],
		["inhaltsbausteine_trennerbild_BlockType", {
			fetch: cms => `
				id
				overlay: textOverlay
				images: datei {
					${cms.fragments.asset}
				}
			`,
			map: ({
				images,
				...rest
			}) => ({
				image: images[0],
				...rest
			})
		}]
	]),
	async render({
		caption = "",
		overlay = "",
		id,
		image
	}, {
		contentTypeIDIf,
		Error,
		helpers: {
			Image,
			License,
			Video
		}
	}) {
		if (!image) {
			return Error.render({
				message: "Invalid attempt to render hero image without providing an image.",
				title: "Image missing"
			});
		}
		const licenseHTML = License.render({
			asset: image
		});
		const isVideo = image.mimeType.substr(0,5) === "video";
		const mediaHTML = isVideo
			? await Video.render({asset: image, controls: false, muted: true, loop: false, autoplay: true})
			: await Image.render({asset: image, imageSize: 200});
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		const overlayHTML = overlay
			? `<figure-overlay>${overlay}</figure-overlay>`
			: "";
		return `
			<section content-type="hero-image" ${contentTypeIDIf(id)}>
				<inner-content>
					<figure figure-type="hero-image">
						${mediaHTML}
						${licenseHTML}
						${captionHTML}
						${overlayHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
