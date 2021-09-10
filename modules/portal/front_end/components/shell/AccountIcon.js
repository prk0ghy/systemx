import Link from "next/link";
import routes from "root/routes";
import styles from "./AccountIcon.module.css";
const AccountIcon = () => (
	<Link href={ routes.login.path }>
		<a className={ styles.accountIcon }>
			👤
		</a>
	</Link>
);
export default AccountIcon;
