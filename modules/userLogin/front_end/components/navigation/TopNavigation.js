import BurgerIcon from "./buttons/BurgerIcon";
import CartIcon from "./buttons/CartIcon";
import cx from "classnames";
import HomeIcon from "./buttons/HomeIcon";
import styles from "./TopNavigation.module.css";
const TopNavigation = ({ className }) => (
	<nav className={ cx(styles.navigation, className) }>
		<ul className={ [styles.items, styles.left].join(" ") }>
			<HomeIcon/>
		</ul>
		<ul className={ [styles.items, styles.right].join(" ") }>
			<CartIcon/>
			<BurgerIcon/>
		</ul>
	</nav>
);
export default TopNavigation;
