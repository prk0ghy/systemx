import styles from "./BurgerIcon.module.css";
import { useBus } from "contexts/Bus";
import { useCallback } from "react";
const BurgerIcon = () => {
	const [, dispatch] = useBus();
	const toggleSideMenu = useCallback(() => {
		dispatch({
			type: "TOGGLE_SIDE_MENU"
		});
	}, [
		dispatch
	]);
	return (
		<button className={ styles.burgerIcon } onClick={ toggleSideMenu } type="button">
			☰
		</button>
	);
};
export default BurgerIcon;
