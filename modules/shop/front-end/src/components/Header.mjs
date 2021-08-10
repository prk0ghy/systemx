import Laced from "components/Laced.mjs";
import Navigation from "components/Navigation.mjs";
import styles from "./Header.css";
export default () => (
	<header className={ styles.header }>
		<Laced>
			<Navigation className={ styles.navigation }/>
		</Laced>
	</header>
);
