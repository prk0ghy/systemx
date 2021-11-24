import cx from "classnames";
import styles from "./LeftRightGroup.module.css";
const LeftRightGroup = ({
	children,
	className
}) => (
	<div className={ cx(styles.leftright, className) }>
		{ children }
	</div>
);
export default LeftRightGroup;
