import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import { useBrand } from "contexts/Brand";
import OrderComplete from "../components/shop/OrderComplete";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Privacy = () => {
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|orderComplete") }>
			<BannerLayout fullHeight headline={ t("titles|orderComplete") } picture={ pictures.orderComplete }>
				<TextContent>
					<OrderComplete/>
				</TextContent>
			</BannerLayout>
		</ShellContent>
	);
};
export default Privacy;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
