import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import Page from "components/shell/Page";
import { useBrand } from "contexts/Brand";
const Checkout = () => {
	const [{
		CheckoutPreviewHeight,
		CheckoutPreviewURL,
		CheckoutPreviewWidth
	}] = useBrand();
	return (
		<Page title="Checkout">
			<BannerLayout autoHeight height={ CheckoutPreviewHeight } image={ CheckoutPreviewURL } width={ CheckoutPreviewWidth }>
				<TextContent>
					<p>Vielen Dank für Ihre Bestellung.</p>
					<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. At vero eos et accusam et justo duo dolores et ea rebum. Elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
				</TextContent>
			</BannerLayout>
		</Page>
	);
};
export default Checkout;
