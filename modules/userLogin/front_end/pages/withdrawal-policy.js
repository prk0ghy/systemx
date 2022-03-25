import { useCallback } from "react";
import WithdrawalPolicy from "components/shop/WithdrawalPolicy";
import routes from "root/routes";
import { useRouter } from "next/router";
import BannerLayout from "components/layouts/BannerLayout";
import { ShellContent } from "components/shell/Shell";
import { useBrand } from "contexts/Brand";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const WithdrawalPolicyPage = () => {
	const router = useRouter();
	const policy = useCallback(() => {
		router.push(routes.checkoutInvoice.path);
	}, [router]);
	const cancel = useCallback(() => {
		router.push(routes.cart.path);
	}, [router]);
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|withdrawalPolicy") }>
			<BannerLayout headline={ t("titles|withdrawalPolicy") } picture={ pictures.imprint }>
				<WithdrawalPolicy onCancel={ cancel } onProceed={ policy }/>
			</BannerLayout>
		</ShellContent>
	);
};
export default WithdrawalPolicyPage;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
