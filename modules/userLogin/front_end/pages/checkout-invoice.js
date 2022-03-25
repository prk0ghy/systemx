import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import InvoiceView from "components/shop/InvoiceView";
import routes from "root/routes";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useBrand } from "contexts/Brand";
import HorizontalSplit from "../components/layouts/HorizontalSplit";
import CartManager from "../components/shop/cart/CartManager";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Cart = () => {
	const router = useRouter();
	const proceed = useCallback(() => {
		router.push(routes.payment.path);
	}, [router]);
	const cancel = useCallback(() => {
		router.push(routes.withdrawalPolicy.path);
	}, [router]);
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|checkout") }>
			<BannerLayout halfHeight headline={ t("titles|checkout") } picture={ pictures.checkout }>
				<TextContent>
					<HorizontalSplit>
						<CartManager readOnly/>
						<InvoiceView onCancel={ cancel } onProceed={ proceed }/>
					</HorizontalSplit>
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
