import Laced from "components/generics/Laced.mjs";
import Navigation from "components/shell/Navigation.mjs";
import styles from "./Header.css";
export default () => (
	<header className={ styles.header }>
		<Laced>
			<Navigation className={ styles.navigation }/>
		</Laced>
	</header>
);
