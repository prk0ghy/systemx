import {
	useCallback,
	useEffect,
	useRef,
	useState
} from "react";
import cx from "classnames";
import Laced from "components/generics/Laced";
import Navigation from "components/navigation/TopNavigation";
import styles from "./Header.module.css";
import { useRouter } from "next/router";
const Header = () => {
	const headerReference = useRef();
	const router = useRouter();
	const [isMinimized, setIsMinimized] = useState(false);
	const [hasNavigated, setHasNavigated] = useState(false);
	const [lastScrollPosition, setLastScrollPosition] = useState(0);
	const handleVisibility = useCallback(() => {
		const limitY = 300;
		const y = window.scrollY;
		const isThresholdPassed = y >= limitY;
		const isLastScrollDirectionDown = lastScrollPosition < y;
		const shouldMinimize = hasNavigated || isThresholdPassed && isLastScrollDirectionDown;
		setIsMinimized(shouldMinimize);
		setLastScrollPosition(y);
		headerReference.current.inert = shouldMinimize;
	}, [
		hasNavigated,
		lastScrollPosition
	]);
	const onRouteChange = useCallback(() => {
		setHasNavigated(true);
		const reset = () => {
			setHasNavigated(false);
			window.removeEventListener("scroll", reset);
		};
		window.addEventListener("scroll", reset, {
			passive: true
		});
	}, [
		setHasNavigated
	]);
	useEffect(() => {
		window.addEventListener("scroll", handleVisibility, {
			passive: true
		});
		return () => {
			window.removeEventListener("scroll", handleVisibility);
		};
	}, [
		handleVisibility
	]);
	useEffect(() => {
		router.events.on("routeChangeComplete", onRouteChange);
		return () => {
			router.events.off("routeChangeComplete", onRouteChange);
		};
	}, [
		onRouteChange,
		router.events
	]);
	const headerClassName = cx(styles.header, {
		[styles.minimized]: isMinimized
	});
	return (
		<header className={ headerClassName } ref={ headerReference }>
			<Laced>
				<Navigation className={ styles.navigation }/>
			</Laced>
		</header>
	);
};
export default Header;
