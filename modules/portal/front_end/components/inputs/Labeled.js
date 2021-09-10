import styles from "./Labeled.module.css";
const Labeled = ({
	children,
	label
}) => (
	<label className={ styles.labeled }>
		<span className={ styles.label }>{ label }</span>
		{ children }
	</label>
);
export default Labeled;
