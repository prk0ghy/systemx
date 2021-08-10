import cx from "classnames";
import { Link } from "react-router-dom";
import routes from "../routes.mjs";
import styles from "./Navigation.css";
export default ({
	className
}) => (
	<nav className={ cx(styles.navigation, className) }>
		<ul className={ styles.items }>
			<li className={ styles.item }>
				<ul className={ styles.items }>
					<li className={ styles.item }>
						<Link className={ styles.link } to={ routes.home.path }>
							<img className={ styles.image } src="/assets/mvet/ui/logo.png"/>
						</Link>
					</li>
				</ul>
			</li>
			<li className={ styles.item }>
				<ul className={ styles.items }>
					<li className={ styles.item }>
						<Link className={ styles.link } to={ routes.authentication.path }>
							<img className={ cx(styles.image, styles.cart) } src="/assets/mvet/ui/cart.png"/>
						</Link>
					</li>
					<li className={ styles.item }>
						<Link className={ styles.link } to={ routes.authentication.path }>
							<span>Mein <b>mVet</b></span>
						</Link>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
);
