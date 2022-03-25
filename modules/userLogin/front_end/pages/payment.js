import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import PaymentView from "components/shop/PaymentView";
import { useBrand } from "contexts/Brand";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Cart = () => {
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|payment") }>
			<BannerLayout picture={ pictures.privacy }>
				<TextContent>
					<PaymentView/>
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
