import cx from "classnames";
import styles from "./Laced.module.css";
const Laced = ({
	children,
	className
}) => (
	<div className={ cx(styles.laced, className) }>
		<div className={ styles.content }>
			{ children }
		</div>
	</div>
);
export default Laced;
