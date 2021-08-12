import Card from "components/Card.mjs";
import Laced from "components/Laced.mjs";
import Page from "components/Page.mjs";
import styles from "./AuthenticationPage.css";
import { useBrand } from "contexts/Brand.mjs";
export default ({
	children,
	title
}) => {
	const [{ assetBaseURL }] = useBrand();
	return (
		<Page title={ title }>
			<div className={ styles.authenticationPage }>
				<img className={ styles.image } src={ `${assetBaseURL}/ui/authentication.jpg` }/>
				<Laced className={ styles.container }>
					<Card>{ children }</Card>
				</Laced>
			</div>
		</Page>
	);
};
