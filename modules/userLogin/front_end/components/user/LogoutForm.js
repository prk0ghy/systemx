import { useRefreshUserData, userLogout } from "root/api";
import Button from "components/inputs/Button.js";
import { H } from "root/format";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./LogoutForm.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useBus } from "contexts/Bus";
import { useCallback } from "react";
import NeverUsers from "components/user/NeverUsers";
import OnlyUsers from "components/user/OnlyUsers";
import { useTranslation } from "next-i18next";
const UserProfile = () => {
	const { t } = useTranslation("common");
	const [{ user }] = useAuthentication();
	const [refresh] = useRefreshUserData();
	const [, dispatch] = useBus();
	const doLogout = useCallback(
		async e => {
			e.preventDefault();
			await userLogout();
			dispatch({
				type: "CLOSE_SIDE_MENU"
			});
			refresh();
		}, [dispatch, refresh]
	);
	return (
		<>
			<OnlyUsers>
				<section className={ styles.userProfile }>
					<h4><H>{ t("loggedInAs") }</H></h4>
					<br/>
					<div>
						<p><PersonIcon className={ styles.icon }/><H>{ user.name }</H></p>
					</div>
					<Button className={ styles.link } kind="primary" onClick={ doLogout } type="submit">{ t("logout") }</Button>
				</section>
			</OnlyUsers>
			<NeverUsers>
				<section className={ styles.userProfile }>
					<h4>{ t("notLoggedIn") }</h4>
				</section>
			</NeverUsers>
		</>
	);
};
export default UserProfile;
