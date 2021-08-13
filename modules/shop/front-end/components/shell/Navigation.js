import cx from "classnames";
import Link from "next/link";
import routes from "root/routes";
import styles from "./Navigation.module.css";
import { useBrand } from "contexts/Brand";
const Navigation = ({ className }) => {
	const [{
		logoHeight,
		logoURL,
		logoWidth,
		name
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
							<Link href={ routes.login.path }>
								<a className={ styles.link }>
									<img
										alt=""
										className={ cx(styles.image, styles.cart) }
										height={ 77 }
										src="/mvet/ui/cart.png"
										width={ 100 }
									/>
								</a>
							</Link>
						</li>
						<li className={ styles.item }>
							<Link href={ routes.login.path }>
								<a className={ styles.link }>
									<span>Mein <b>{ name }</b></span>
								</a>
							</Link>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	);
};
export default Navigation;
