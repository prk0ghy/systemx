import cx from "classnames";
import { FocusOn } from "react-focus-on";
import Library from "components/shell/Library";
import styles from "./SideMenu.module.css";
import { useBus } from "contexts/Bus";
import { useCallback } from "react";
const SideMenu = () => {
	const [{ isSideMenuOpen }, dispatch] = useBus();
	const boxClassName = cx(styles.box, {
		[styles.open]: isSideMenuOpen
	});
	const toggleSideMenu = useCallback(() => {
		dispatch({
			type: "TOGGLE_SIDE_MENU"
		});
	}, [
		dispatch
	]);
	return (
		<FocusOn
			enabled={ isSideMenuOpen }
			onEscapeKey={ toggleSideMenu }
		>
			<div className={ boxClassName }>
				<div className={ styles.dismisser } onClick={ toggleSideMenu }/>
				<div className={ styles.sideMenu }>
					<Library/>
				</div>
			</div>
		</FocusOn>
	);
};
export default SideMenu;
