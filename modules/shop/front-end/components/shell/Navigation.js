import AccountIcon from "components/shell/AccountIcon";
import BurgerIcon from "components/shell/BurgerIcon";
import cx from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import routes from "root/routes";
import styles from "./Navigation.module.css";
import { useBrand } from "contexts/Brand";
const CartIcon = dynamic(() => import("./CartIcon"), {
	ssr: false
});
const Navigation = ({ className }) => {
	const [{
		logoHeight,
		logoURL,
		logoWidth
	}] = useBrand();
	return (
		<nav className={ cx(styles.navigation, className) }>
			<ul className={ styles.items }>
				<li className={ styles.item }>
					<ul className={ styles.items }>
						<li className={ styles.item }>
							<Link href={ routes.home.path }>
								<a className={ styles.link }>
									<img
										alt="Logo"
										className={ styles.image }
										height={ logoHeight }
										src={ logoURL }
										width={ logoWidth }
									/>
								</a>
							</Link>
						</li>
					</ul>
				</li>
				<li className={ styles.item }>
					<ul className={ styles.items }>
						<li className={ styles.item }>
							<CartIcon/>
						</li>
						<li className={ styles.item }>
							<AccountIcon/>
						</li>
						<li className={ styles.item }>
							<BurgerIcon/>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	);
};
export default Navigation;
