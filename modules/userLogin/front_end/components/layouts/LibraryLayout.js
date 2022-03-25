import Laced from "components/generics/Laced";
import styles from "./LibraryLayout.module.css";
const LibraryLayout = ({ children }) => {
	return (
		<div className={ styles.libraryLayout }>
			<Laced className={ styles.container }>
				{ children }
			</Laced>
		</div>
	);
};
export default LibraryLayout;
