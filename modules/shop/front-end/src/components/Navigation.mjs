import cx from "classnames";
import { Link } from "react-router-dom";
import routes from "../routes.mjs";
import styles from "./Navigation.css";
import { useBrand } from "contexts/Brand.mjs";
export default ({ className }) => {
	const [{
		assetBaseURL,
		name
	}] = useBrand();
	return (
		<nav className={ cx(styles.navigation, className) }>
			<ul className={ styles.items }>
				<li className={ styles.item }>
					<ul className={ styles.items }>
						<li className={ styles.item }>
							<Link className={ styles.link } to={ routes.home.path }>
								<img className={ styles.image } src={ `${assetBaseURL}/ui/logo.png` }/>
							</Link>
						</li>
					</ul>
				</li>
				<li className={ styles.item }>
					<ul className={ styles.items }>
						<li className={ styles.item }>
							<Link className={ styles.link } to={ routes.login.path }>
								<img className={ cx(styles.image, styles.cart) } src={ `${assetBaseURL}/ui/cart.png` }/>
							</Link>
						</li>
						<li className={ styles.item }>
							<Link className={ styles.link } to={ routes.login.path }>
								<span>Mein <b>{ name }</b></span>
							</Link>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	);
};
