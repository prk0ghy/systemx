import Card from "components/generics/Card.mjs";
import Laced from "components/generics/Laced.mjs";
import styles from "./AuthenticationLayout.css";
import { useBrand } from "contexts/Brand.mjs";
export default ({ children }) => {
	const [{ assetBaseURL }] = useBrand();
	return (
		<div className={ styles.authenticationLayout }>
			<img className={ styles.image } src={ `${assetBaseURL}/ui/authentication.jpg` }/>
			<Laced className={ styles.container }>
				<Card>{ children }</Card>
			</Laced>
		</div>
	);
};
