import Card from "components/generics/Card";
import Laced from "components/generics/Laced";
import styles from "./AuthenticationLayout.module.css";
const AuthenticationLayout = ({ children }) => {
	return (
		<div className={ styles.authenticationLayout }>
			<Laced className={ styles.container }>
				<Card>{ children }</Card>
			</Laced>
		</div>
	);
};
export default AuthenticationLayout;
