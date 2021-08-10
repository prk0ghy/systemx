import Laced from "components/Laced.mjs";
import Page from "components/Page.mjs";
import ProductList from "components/ProductList.mjs";
import styles from "./Home.css";
export default () => (
	<Page title="Home">
		<header className={ styles.header }>
			<img className={ styles.heroImage } src="/assets/mvet/ui/hero.jpg"/>
			<div className={ styles.content }>
				<div className={ styles.text }>
					<Laced>
						<h1>
							<span className={ styles.small }>Das Portal für</span>
							<br/>
							Tiermedizin
						</h1>
					</Laced>
				</div>
			</div>
		</header>
		<ProductList/>
	</Page>
);
