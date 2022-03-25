import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import { useBrand } from "contexts/Brand";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Imprint = () => {
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent headerNoBlur title={ t("titles|imprint") }>
			<BannerLayout headline={ t("titles|imprint") } picture={ pictures.imprint }>
				<TextContent>
					<h2>{ t("imprint|title") }</h2>
					<p/>
					<p>{ t("imprint|0") }</p>
					<p>{ t("imprint|addr0") }</p>
					<p>{ t("imprint|addr1") }</p>
					<p>{ t("imprint|addr2") }</p>
					<p>{ t("imprint|addr3") }</p>
					<p>{ t("imprint|1") }</p>
					<p>{ t("imprint|2") }</p>
					<h3>{ t("imprint|3") }</h3>
					<p/>
					<p>{ t("imprint|4") }</p>
					<h2>{ t("imprint|5") }</h2>
					<p/>
					<h3>{ t("imprint|6") }</h3>
					<p/>
					<p>{ t("imprint|7") }</p>
					<p>{ t("imprint|8") }</p>
					<h3>{ t("imprint|9") }</h3>
					<p/>
					<p>{ t("imprint|10") }</p>
					<p>{ t("imprint|11") }</p>
					<h3>{ t("imprint|12") }</h3>
					<p/>
					<p>{ t("imprint|13") }</p>
					<p>{ t("imprint|14") }</p>
				</TextContent>
			</BannerLayout>
		</ShellContent>
	);
};
export default Imprint;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
