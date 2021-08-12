import BannerLayout from "components/layouts/BannerLayout.mjs";
import Page from "components/shell/Page.mjs";
import ProductList from "components/marketing/ProductList.mjs";
import styles from "./Home.css";
import { useBrand } from "contexts/Brand.mjs";
export default () => {
	const [{
		assetBaseURL,
		subjectMatter
	}] = useBrand();
	const headline = (
		<>
			<div className={ styles.small }>Das Portal für</div>
			<div>{ subjectMatter }</div>
		</>
	);
	return (
		<Page title="Startseite">
			<BannerLayout className={ styles.home } headline={ headline } image={ `${assetBaseURL}/ui/hero.jpg` }>
				<ProductList/>
			</BannerLayout>
		</Page>
	);
};
