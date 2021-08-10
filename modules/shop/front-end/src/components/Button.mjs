import cx from "classnames";
import styles from "./Button.css";
export default ({
	children,
	className,
	kind,
	...rest
}) => {
	const buttonClassName = cx(styles.button, className, styles[kind]);
	return (
		<button className={ buttonClassName } { ...rest }>
			{ children }
		</button>
	);
};
