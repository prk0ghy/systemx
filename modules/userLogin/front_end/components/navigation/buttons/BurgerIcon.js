import styles from "./BurgerIcon.module.css";
import { useBus } from "contexts/Bus";
import { useCallback } from "react";
import NeverUsers from "components/user/NeverUsers";
import OnlyUsers from "components/user/OnlyUsers";
import { useTranslation } from "next-i18next";
const BurgerIcon = () => {
	const { t } = useTranslation("common");
	const [, dispatch] = useBus();
	const toggleSideMenu = useCallback(() => {
		dispatch({
			type: "TOGGLE_SIDE_MENU"
		});
	}, [
		dispatch
	]);
	return (
		<li>
			<button className={ styles.burgerIcon } onClick={ toggleSideMenu } type="button">
				<OnlyUsers>
					<span className={ styles.fat }>{ t("my") }</span> { t("product") }
				</OnlyUsers>
				<NeverUsers>
					{ t("login") }
				</NeverUsers>
			</button>
		</li>
	);
};
export default BurgerIcon;
