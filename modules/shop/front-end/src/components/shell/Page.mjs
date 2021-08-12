import { useEffect } from "react";
export default ({
	children,
	title
}) => {
	useEffect(() => {
		document.title = title;
	}, [
		title
	]);
	return children;
};
