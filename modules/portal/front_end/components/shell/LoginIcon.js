import Link from "next/link";
import PersonIcon from "@mui/icons-material/PersonOutline";
import routes from "root/routes";
import styles from "./LoginIcon.module.css";

const LogoutIcon = () => {
	return (
		<Link href={ routes.login.path }>
			<a className={ styles.loginIcon }>
				<PersonIcon className={ styles.startIcon }/>
			</a>
		</Link>
	);
};
export default LogoutIcon;
