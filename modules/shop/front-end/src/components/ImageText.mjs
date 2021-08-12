import cx from "classnames";
import styles from "./ImageText.css";
export default ({
	children,
	className
}) => (
	<span className={ cx(styles.imageText, className) }>{ children }</span>
);
