import config from "../../../config.mjs";

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
				slug
				typeHandle
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
		EditorialError,
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
		const activeVgWort = vgWortPixel
			? `<script>const vgWortPixel = ${JSON.stringify(vgWortPixel)};</script>`
			: config.vgRequired
				? EditorialError.render({
					message: `There is no VG-Wort-Pixel defined for this page, even though they are required, please add one before publishing.`,
					type: "inhalt_inhalt_Entry"
				})
				: "";
		return `
			<main content-type="content" ${contentTypeIDIf(id)}>
				${heroImageWrap}
				${activeVgWort}
				${headlineHTML}
				${children.join("")}
			</main>
		`;
	}
};
