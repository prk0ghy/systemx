import cx from "classnames";
import styles from "./Button.css";
export default ({
	children,
	className,
	kind,
	type = "button",
	...rest
}) => {
	const buttonClassName = cx(styles.button, className, styles[kind]);
	return (
		/* eslint-disable-next-line react/button-has-type */
		<button className={ buttonClassName } type={ type } { ...rest }>
			{ children }
		</button>
	);
};
