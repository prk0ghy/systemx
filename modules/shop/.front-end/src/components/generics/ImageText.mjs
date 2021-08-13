import cx from "classnames";
import styles from "./ImageText.css";
export default ({
	children,
	className
}) => (
	<div className={ cx(styles.imageText, className) }>{ children }</div>
);
