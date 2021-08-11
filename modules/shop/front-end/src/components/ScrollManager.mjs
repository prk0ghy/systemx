import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
let lastPathName;
export default () => {
	const { pathname } = useLocation();
	useLayoutEffect(() => {
		if (lastPathName !== pathname) {
			window.scrollTo(0, 0);
			lastPathName = pathname;
		}
	}, [
		pathname
	]);
	return null;
};
