export default {
	queries: new Map([
		["inhalt_inhalt_Entry", {
			fetch: ({ fragments }) => `
				elements: ${fragments.elements}
				heroImageCaption: bildunterschrift
				heroImages: heroimage {
					${fragments.asset}
				}
				heroImagesMobile: heroimageMobile {
					${fragments.asset}
				}
				id
				title
				titleOverride: title_override
				vgWortPixel
			`,
			map: ({
				heroImages,
				heroImagesMobile,
				...rest
			}) => ({
				heroImage: heroImages[0],
				heroImageMobile: heroImagesMobile[0],
				...rest
			})
		}]
	]),
	async render({
		elements,
		heroImageCaption,
		heroImage,
		heroImageMobile,
		id,
		title,
		titleOverride,
		vgWortPixel
	}, {
		contentTypeIDIf,
		contentTypes: {
			Headline,
			HeroImage
		},
		render
	}) {
		const children = await Promise.all(elements.map(element => render(element)));
		const heroImageHTML = heroImage
			? await HeroImage.render({
				caption: heroImageCaption,
				image: heroImage,
				uid: `${id}-hero-image`
			})
			: "";
		const heroImageMobileHTML = heroImageMobile
			? await HeroImage.render({
				caption: heroImageCaption,
				image: heroImageMobile,
				uid: `${id}-hero-image`
			})
			: "";
		const heroImageWrap = heroImageMobileHTML ?
			`<desktop-only>${heroImageHTML}</desktop-only>
			<mobile-only>${heroImageMobileHTML}</mobile-only>`
			: heroImageHTML;
		const headlineHTML = Headline.render({
			headline: titleOverride || title,
			tag: "h1"
		});
		return `
			<script>const vgWortPixel = ${JSON.stringify(vgWortPixel)};</script>
			<main content-type="content" ${contentTypeIDIf(id)}>
				${heroImageWrap}
				${headlineHTML}
				${children.join("")}
			</main>
		`;
	}
};
