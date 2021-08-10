import { useEffect } from "react";
export default ({
	children,
	className,
	title
}) => {
	useEffect(() => {
		document.title = title;
	}, []);
	return children;
};
