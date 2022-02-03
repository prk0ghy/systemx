import { useRefreshUserData, userLogout } from "root/api";
import Door from "@mui/icons-material/Logout";
import styles from "./LogoutIcon.module.css";
import { useCallback } from "react";
const LogoutIcon = () => {
	const [refresh] = useRefreshUserData();
	const doLogout = useCallback(
		async e => {
			e.preventDefault();
			await userLogout();
			refresh();
		}, [refresh]
	);
	return (
		<button className={ styles.logoutIcon } onClick={ doLogout } type="button">
			<Door className={ styles.exitIcon }/>
		</button>
	);
};
export default LogoutIcon;
