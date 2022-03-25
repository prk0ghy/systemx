import Link from "next/link";
import OnlyUsers from "components/user/OnlyUsers";
import routes from "root/routes";
import styles from "./AccountIcon.module.css";
const AccountIcon = () => (
	<OnlyUsers>
		<li>
			<Link href={ routes.login.path }>
				<a className={ styles.accountIcon }>
					👤
				</a>
			</Link>
		</li>
	</OnlyUsers>
);
export default AccountIcon;
