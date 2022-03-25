import BannerLayout from "components/layouts/BannerLayout";
import ProductList from "components/product/ProductList";
import styles from "./index.module.css";
import { useBrand } from "contexts/Brand";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Home = () => {
	const [{
		pictures,
		subjectMatter
	}] = useBrand();
	const { t } = useTranslation("common");
	const headline = (
		<div>Das Portal für { subjectMatter } - Besondere Tiere brauchen besondere Tierärzte</div>
	);
	return (
		<ShellContent title={ t("titles|landing") }>
			<BannerLayout autoHeight className={ styles.home } headline={ headline } picture={ pictures.home } showLogo>
				<ProductList/>
			</BannerLayout>
		</ShellContent>
	);
};
export default Home;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
