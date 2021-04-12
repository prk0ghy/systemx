export default {
	queries: new Map([
		["inhaltsbausteine_heroimage_BlockType", cms => `
			__typename
			images: bild {
				${cms.fragments.asset}
			}
		`],
		["inhaltsbausteine_trennerbild_BlockType", cms => `
			__typename
			images: datei {
				${cms.fragments.asset}
			}
		`]
	]),
	render({
		caption,
		images
	}, {
		Error,
		helpers: {
			Image,
			License
		}
	}) {
		const image = images[0];
		if (!image) {
			return Error.render({
				message: "Invalid attempt to render hero image without providing any images.",
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
			<section content-type="hero-image">
				<inner-content>
					<figure figure-type="hero-image">
						${Image.render({ asset: image })}
						${licenseHTML}
						${captionHTML}
					</figure>
				</inner-content>
			</section>
		`;
	}
};
