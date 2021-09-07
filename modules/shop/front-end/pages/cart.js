import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import dynamic from "next/dynamic";
import Page from "components/shell/Page";
import { useBrand } from "contexts/Brand";
const CheckoutManager = dynamic(() => import("components/marketing/CheckoutManager"), {
	ssr: false
});
const Cart = () => {
	const [{
		CheckoutPreviewHeight,
		CheckoutPreviewURL,
		CheckoutPreviewWidth
	}] = useBrand();
	return (
		<Page title="Einkaufswagen">
			<BannerLayout halfHeight height={ CheckoutPreviewHeight } image={ CheckoutPreviewURL } width={ CheckoutPreviewWidth }>
				<TextContent>
					<CheckoutManager/>
				</TextContent>
			</BannerLayout>
		</Page>
	);
};
export default Cart;
