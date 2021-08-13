import Card from "components/generics/Card";
import Laced from "components/generics/Laced";
import styles from "./AuthenticationLayout.module.css";
import { useBrand } from "contexts/Brand";
const AuthenticationLayout = ({ children }) => {
	const [{
		authenticationPreviewHeight,
		authenticationPreviewURL,
		authenticationPreviewWidth
	}] = useBrand();
	return (
		<div className={ styles.authenticationLayout }>
			<img
				alt=""
				className={ styles.image }
				height={ authenticationPreviewHeight }
				src={ authenticationPreviewURL }
				width={ authenticationPreviewWidth }
			/>
			<Laced className={ styles.container }>
				<Card>{ children }</Card>
			</Laced>
		</div>
	);
};
export default AuthenticationLayout;
