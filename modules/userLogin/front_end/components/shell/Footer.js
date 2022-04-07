import Laced from "components/generics/Laced";
import Link from "next/link";
import routes from "root/routes";
import styles from "./Footer.module.css";
import { useTranslation } from "next-i18next";
const Footer = () => {
	const { t } = useTranslation("common");
	const footerRoutes = [];
	footerRoutes.push(routes.imprint);
	footerRoutes.push(routes.privacy);
	footerRoutes.push(routes.termsAndConditions);
	const i18nKeys = [
		"imprint",
		"privacy",
		"termsAndConditions"
	];
	const items = footerRoutes.map((route, i) => (
		<li className={ styles.item } key={ route.path }>
			<Link href={ route.path }>
				<a className={ styles.link }>{ t(`titles|${i18nKeys[i]}`) }</a>
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
