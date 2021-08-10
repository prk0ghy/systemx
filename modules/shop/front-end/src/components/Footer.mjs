import Laced from "components/Laced.mjs";
import { Link } from "react-router-dom";
import routes from "../routes.mjs";
import styles from "./Footer.css";
export default () => {
	const footerRoutes = [
		routes.imprint,
		routes.privacy,
		routes.termsAndConditions
	];
	const items = footerRoutes.map(route => (
		<li className={ styles.item } key={ route.path }>
			<Link className={ styles.link } to={ route.path }>{ route.name }</Link>
		</li>
	));
	return (
		<footer className={ styles.footer }>
			<Laced>
				<nav>
					<ul className={ styles.items }>
						{ items }
					</ul>
				</nav>
			</Laced>
		</footer>
	);
};
