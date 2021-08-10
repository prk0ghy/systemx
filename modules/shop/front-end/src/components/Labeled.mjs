import styles from "./Labeled.css";
export default ({
	children,
	label
}) => (
	<label className={ styles.labeled }>
		<span className={ styles.label }>{ label }</span>
		{ children }
	</label>
);
