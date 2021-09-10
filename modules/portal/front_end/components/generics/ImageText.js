import cx from "classnames";
import styles from "./ImageText.module.css";
const ImageText = ({
	children,
	className
}) => (
	<div className={ cx(styles.imageText, className) }>{ children }</div>
);
export default ImageText;
