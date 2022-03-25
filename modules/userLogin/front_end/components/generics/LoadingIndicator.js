import cx from "classnames";
import styles from "./LoadingIndicator.module.css";
const LoadingIndicator = ({ className }) => (
	<div className={ cx(styles.wrap, className) }>
		<div className={ [styles.indicator, styles.rotateG_01].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_02].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_03].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_04].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_05].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_06].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_07].join(" ") }/>
		<div className={ [styles.indicator, styles.rotateG_08].join(" ") }/>
	</div>
);
export default LoadingIndicator;
