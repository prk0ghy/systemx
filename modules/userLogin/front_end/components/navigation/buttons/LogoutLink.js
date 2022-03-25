import { useRefreshUserData, userLogout } from "root/api";
import OnlyUsers from "components/user/OnlyUsers";
import styles from "./LogoutLink.module.css";
import { useBus } from "contexts/Bus";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
const LogoutIcon = () => {
	const { t } = useTranslation("common");
	const [refresh] = useRefreshUserData();
	const [, dispatch] = useBus();
	const router = useRouter();
	const doLogout = useCallback(
		async e => {
			e.preventDefault();
			await userLogout();
			dispatch({
				type: "CLOSE_SIDE_MENU"
			});
			refresh();
			router.push("/");
		}, [dispatch, refresh, router]
	);
	return (
		<OnlyUsers>
			<div className={ styles.button } onClick={ doLogout }>
				{ t("logout") }
			</div>
		</OnlyUsers>
	);
};
export default LogoutIcon;
