import styles from "./Card.css";
export default ({ children }) => (
	<div className={ styles.card }>
		{ children }
	</div>
);
