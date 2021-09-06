import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import dynamic from "next/dynamic";
import Page from "components/shell/Page";
import { useBrand } from "contexts/Brand";
const CheckoutManager = dynamic(() => import("components/marketing/CheckoutManager"), {
	ssr: false
});
const Cart = () => {
	const [{
		imprintPreviewHeight,
		imprintPreviewURL,
		imprintPreviewWidth
	}] = useBrand();
	return (
		<Page title="Einkaufswagen">
			<BannerLayout halfHeight height={ imprintPreviewHeight } image={ imprintPreviewURL } width={ imprintPreviewWidth }>
				<TextContent>
					<CheckoutManager/>
				</TextContent>
			</BannerLayout>
		</Page>
	);
};
export default Cart;
