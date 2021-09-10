import styles from "./Library.module.css";
const Library = () => (
	<div className={ styles.library }>
		<h3>Bibliothek</h3>
		<ul className={ styles.items }>
			<li className={ styles.item }><a href="#">Lorem</a></li>
			<li className={ styles.item }>Ipsum</li>
		</ul>
	</div>
);
export default Library;
