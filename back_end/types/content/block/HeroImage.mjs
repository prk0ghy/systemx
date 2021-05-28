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
		caption,
		id,
		image
	}, {
		contentTypeIDIf,
		Error,
		helpers: {
			Image,
			License
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
		const captionHTML = caption
			? `<figcaption>${caption}</figcaption>`
			: "";
		return `
			<section content-type="hero-image" ${contentTypeIDIf(id)}>
				<inner-content>
					<figure figure-type="hero-image">
						${await Image.render({ asset: image })}
						${licenseHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
