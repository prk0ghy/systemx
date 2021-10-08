import styles from "./Library.module.css";
import { useAuthentication } from "contexts/Authentication";

const Library = () => {
	const [{ user }] = useAuthentication();
	return (
		<div className={ styles.library }>
			<h3>Bibliothek</h3>
			{ user
				? (
					<ul className={ styles.items }>
						<li className={ styles.item }><a href="#">Lorem</a></li>
						<li className={ styles.item }>Ipsum</li>
					</ul>
				)
				: null
			}
		</div>
	);
};
export default Library;
