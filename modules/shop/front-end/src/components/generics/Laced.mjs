import cx from "classnames";
import styles from "./Laced.css";
export default ({
	children,
	className
}) => (
	<div className={ cx(styles.laced, className) }>
		<div className={ styles.content }>
			{ children }
		</div>
	</div>
);
