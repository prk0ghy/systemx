import AccountIcon from "./icons/AccountIcon";
import BurgerIcon from "./icons/BurgerIcon";
import Configuration from "../../config";
import cx from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoginIcon from "./icons/LoginIcon";
import LogoutIcon from "./icons/LogoutIcon";
import routes from "root/routes";
import styles from "./TopNavigation.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useBrand } from "contexts/Brand";

const CartIcon = dynamic(() => import("./icons/CartIcon"), {
	ssr: false
});
const NavigationItems = () => {
	const [{ user }] = useAuthentication();
	const isLoggedIn = Boolean(user?.name);
	return (
		<>
			{ Configuration?.shoppingCart?.enabled
				? (
					<li className={ styles.item }>
						<CartIcon/>
					</li>
				)
				: null
			}
			{ isLoggedIn
				? (
					<li className={ styles.item }>
						<AccountIcon/>
					</li>
				)
				: null
			}
			{ isLoggedIn
				? (
					<li className={ styles.item }>
						<LogoutIcon/>
					</li>
				)
				: null
			}
			{ isLoggedIn
				? null
				: (
					<li className={ styles.item }>
						<LoginIcon/>
					</li>
				)
			}
			{ Configuration?.burgerMenu?.enabled
				? (
					<li className={ styles.item }>
						<BurgerIcon/>
					</li>
				)
				: null
			}
		</>
	);
};
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
						<NavigationItems/>
					</ul>
				</li>
			</ul>
		</nav>
	);
};
export default Navigation;
