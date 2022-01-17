import Configuration from "../../config.js";
import Laced from "components/generics/Laced";
import Link from "next/link";
import routes from "root/routes";
import styles from "./Footer.module.css";
const Footer = () => {
	const footerRoutes = [];

	footerRoutes.push(routes.imprint);
	footerRoutes.push(routes.privacy);

	if (Configuration?.termsAndConditions?.enabled) {
		footerRoutes.push(routes.termsAndConditions);
	}
	const items = footerRoutes.map(route => (
		<li className={ styles.item } key={ route.path }>
			<Link href={ route.path }>
				<a className={ styles.link }>{ route.name }</a>
			</Link>
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
export default Footer;
