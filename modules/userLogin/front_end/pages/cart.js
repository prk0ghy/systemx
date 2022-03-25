import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import dynamic from "next/dynamic";
import { useBrand } from "contexts/Brand";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const CheckoutManager = dynamic(() => import("components/shop/CheckoutManager"), {
	ssr: false
});
const Cart = () => {
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|cart") }>
			<BannerLayout halfHeight picture={ pictures.checkout }>
				<TextContent>
					<CheckoutManager/>
				</TextContent>
			</BannerLayout>
		</ShellContent>
	);
};
export default Cart;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
