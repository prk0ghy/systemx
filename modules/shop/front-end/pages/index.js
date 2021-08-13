import BannerLayout from "components/layouts/BannerLayout";
import Page from "components/shell/Page";
import ProductList from "components/marketing/ProductList";
import styles from "./Home.module.css";
import { useBrand } from "contexts/Brand";
const Home = () => {
	const [{
		homePreviewHeight,
		homePreviewURL,
		homePreviewWidth,
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
			<BannerLayout className={ styles.home } headline={ headline } height={ homePreviewHeight } image={ homePreviewURL } width={ homePreviewWidth }>
				<ProductList/>
			</BannerLayout>
		</Page>
	);
};
export default Home;
