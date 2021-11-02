import { useCallback, useState } from "react";
import BannerLayout from "components/layouts/BannerLayout";
import Page from "components/shell/Page";
import ProductList from "components/marketing/ProductList";
import styles from "./Home.module.css";
import { useBrand } from "contexts/Brand";
import { useRefreshUserData } from "/api.js";

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
	const hlTagungsb = (
		<>
			<div>Tagungsbände</div>
		</>
	);
	const [refresh] = useRefreshUserData();
	const [tagesb, setTagesb] = useState("");
	const ToggleTagesb = useCallback(
		value => {
			setTagesb(value);
			refresh();
		}, [refresh, setTagesb]
	);
	return (
		<> {
			tagesb
				? (
					<Page title="Tagungsbände">
						<BannerLayout className={ styles.home } headline={ hlTagungsb } height={ homePreviewHeight } image={ homePreviewURL } width={ homePreviewWidth }>
							<ProductList ToggleTagesb={ ToggleTagesb } tagesb={ tagesb }/>
						</BannerLayout>
					</Page>
				)
				: (
					<Page title="Startseite">
						<BannerLayout className={ styles.home } headline={ headline } height={ homePreviewHeight } image={ homePreviewURL } width={ homePreviewWidth }>
							<ProductList ToggleTagesb={ ToggleTagesb } tagesb={ tagesb }/>
						</BannerLayout>
					</Page>
				)
		}
		</>
	);
};
export default Home;
