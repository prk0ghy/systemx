import Laced from "components/Laced.mjs";
import Page from "components/Page.mjs";
import ProductList from "components/ProductList.mjs";
import styles from "./Home.css";
import { useBrand } from "contexts/Brand.mjs";
export default () => {
	const [{ assetBaseURL }] = useBrand();
	return (
		<Page title="Home">
			<header className={ styles.header }>
				<img className={ styles.heroImage } src={ `${assetBaseURL}/ui/hero.jpg` }/>
				<div className={ styles.content }>
					<div className={ styles.text }>
						<Laced>
							<h1>
								<span className={ styles.small }>Das Portal für</span>
								<br/>
								<span className={ styles.big }>Tiermedizin</span>
							</h1>
						</Laced>
					</div>
				</div>
			</header>
			<ProductList/>
		</Page>
	);
};
