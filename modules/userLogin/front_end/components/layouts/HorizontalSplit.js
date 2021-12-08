import styles from "./HorizontalSplit.module.css";
const HorizontalSplit = ({ children }) => {
	return (
		<div className={ styles.horizontalSplit }>
			{ children }
		</div>
	);
};
export default HorizontalSplit;
