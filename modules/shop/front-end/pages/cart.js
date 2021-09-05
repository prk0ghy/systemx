import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import dynamic from "next/dynamic";
import Page from "components/shell/Page";
import { useBrand } from "contexts/Brand";
const CartManager = dynamic(() => import("components/marketing/CartManager"), {
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
			<BannerLayout headline="Einkaufswagen" height={ imprintPreviewHeight } image={ imprintPreviewURL } width={ imprintPreviewWidth }>
				<TextContent>
					<CartManager/>
				</TextContent>
			</BannerLayout>
		</Page>
	);
};
export default Cart;
