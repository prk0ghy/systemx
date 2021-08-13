import Laced from "components/generics/Laced";
import Navigation from "components/shell/Navigation";
import styles from "./Header.module.css";
const Header = () => (
	<header className={ styles.header }>
		<Laced>
			<Navigation className={ styles.navigation }/>
		</Laced>
	</header>
);
export default Header;
