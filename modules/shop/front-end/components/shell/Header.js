import {
	useCallback,
	useEffect,
	useState
} from "react";
import cx from "classnames";
import Laced from "components/generics/Laced";
import Navigation from "components/shell/Navigation";
import styles from "./Header.module.css";
const Header = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const handleScroll = useCallback(() => {
		const limitY = 240;
		setIsExpanded(window.scrollY >= limitY);
	}, []);
	useEffect(() => {
		window.addEventListener("scroll", handleScroll, {
			passive: true
		});
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [
		handleScroll
	]);
	const headerClassName = cx(styles.header, {
		[styles.expanded]: isExpanded
	});
	return (
		<header className={ headerClassName }>
			<Laced>
				<Navigation className={ styles.navigation }/>
			</Laced>
		</header>
	);
};
export default Header;
