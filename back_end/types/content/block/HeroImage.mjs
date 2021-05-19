export default {
	queries: new Map([
		["inhaltsbausteine_heroimage_BlockType", {
			fetch: cms => `
				__typename
				id
				images: bild {
					${cms.fragments.asset}
				}
			`
		}],
		["inhaltsbausteine_trennerbild_BlockType", {
			fetch: cms => `
				__typename
				id
				images: datei {
					${cms.fragments.asset}
				}
			`
		}]
	]),
	async render({
		caption,
		id,
		images
	}, {
		contentTypeIDIf,
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
