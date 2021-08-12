import ImageText from "components/ImageText.mjs";
import Laced from "components/Laced.mjs";
import Page from "components/Page.mjs";
import ProductList from "components/ProductList.mjs";
import styles from "./Home.css";
import { useBrand } from "contexts/Brand.mjs";
export default () => {
	const [{
		assetBaseURL,
		subjectMatter
	}] = useBrand();
	return (
		<Page title="Home">
			<header className={ styles.header }>
				<img className={ styles.heroImage } src={ `${assetBaseURL}/ui/hero.jpg` }/>
				<div className={ styles.content }>
					<div className={ styles.text }>
						<Laced>
							<h1>
								<ImageText className={ styles.small }>Das Portal für</ImageText>
								<br/>
								<ImageText className={ styles.big }>{ subjectMatter }</ImageText>
							</h1>
						</Laced>
					</div>
				</div>
			</header>
			<ProductList/>
		</Page>
	);
};
