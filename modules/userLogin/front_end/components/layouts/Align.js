import styles from "./Align.module.css";
const Align = ({
	children, center = false, left = false, right = false
}) => {
	const classes = [center && styles.center, left && styles.left, right && styles.right].filter(v => v).join("");
	return (
		<div className={ classes }>
			{ children }
		</div>
	);
};
export default Align;
