import ProductChildren from "components/product/ProductChildren";
import ProductDetails from "components/product/ProductDetails";
import NotFound from "./../404";
import { ShellContent } from "components/shell/Shell";
import { findProduct } from "user-login-common/product";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const ProductPage = ({ productID }) => {
	// Const router = useRouter();
	const product = findProduct(productID);
	const { t } = useTranslation("common");
	return !product
		? <NotFound msg={ t("404product") }/>
		: (
			<ShellContent headerBackgroundColor="var(--color-main)" title={ product.name }>
				{ product.children
					? <ProductChildren product={ product }/>
					: <ProductDetails product={ product }/>
				}
			</ShellContent>
		);
};
export default ProductPage;
export const getStaticProps = async ({
	locale, params: { pid }
}) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			productID: pid
		}
	};
};
export const getStaticPaths = () => ({
	paths: [],
	fallback: true
});
