import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import { useBrand } from "contexts/Brand";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Privacy = () => {
	const [{ pictures }] = useBrand();
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|privacy") }>
			<BannerLayout headline={ t("titles|privacy") } picture={ pictures.privacy }>
				<TextContent>
					<h1>{ t("privacy|0") }</h1>
					<p/>
					<h2>{ t("privacy|1") }</h2>
					<p/>
					<p>{ t("privacy|2") }</p>
					<h2>{ t("privacy|3") }</h2>
					<p/>
					<p>{ t("privacy|4") }</p>
					<h2>{ t("privacy|5") }</h2>
					<p/>
					<p>{ t("privacy|6") }</p>
					<p>{ t("privacy|7") }</p>
					<h2>{ t("privacy|8") }</h2>
					<p/>
					<p>{ t("privacy|9") }</p>
					<p>{ t("privacy|10") }</p>
					<h2>{ t("privacy|11") }</h2>
					<p/>
					<p>{ t("privacy|12") } <a href="https://matomo.org/privacy/">https://matomo.org/privacy/</a></p>
					<h2>{ t("privacy|13") }</h2>
					<p/>
					<p>{ t("privacy|14") }</p>
					<p>{ t("privacy|15") }</p>
					<h2>{ t("privacy|16") }</h2>
					<p/>
					<p>{ t("privacy|17") }</p>
					<h2>{ t("privacy|18") }</h2>
					<p/>
					<p>{ t("privacy|19") } <a href="mailto:info@dilewe.de">info@dilewe.de</a></p>
					<p><br/><a href="https://github.com/Digitale-Lernwelten/systemx">https://github.com/Digitale-Lernwelten/systemx<br/></a></p>
					<h2>{ t("privacy|20") }</h2>
					<p/>
					<p>{ t("privacy|21") }</p>
					<p>{ t("privacy|22") }</p>
					<p>{ t("privacy|23") }</p>
					<p>{ t("privacy|24") }</p>
					<p>{ t("privacy|25") }</p>
					<p>{ t("privacy|26") }</p>
					<h2>{ t("privacy|27") }</h2>
					<p/>
					<p>{ t("privacy|28") }</p>
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
