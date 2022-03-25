import Link from "next/link";
import NeverUsers from "components/user/NeverUsers";
import PersonIcon from "@mui/icons-material/PersonOutline";
import routes from "root/routes";
import styles from "./LoginIcon.module.css";
const LogoutIcon = () => (
	<NeverUsers>
		<li>
			<Link href={ routes.login.path }>
				<a className={ styles.loginIcon }>
					<PersonIcon className={ styles.startIcon }/>
				</a>
			</Link>
		</li>
	</NeverUsers>
);
export default LogoutIcon;
