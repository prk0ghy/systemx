import Laced from "components/generics/Laced";
import styles from "./AuthenticationLayout.module.css";
const AuthenticationLayout = ({
	children,
	resetPassword = false
}) => {
	return (
		<div className={ [styles.authenticationLayout,
			resetPassword
				? styles.resetPassword
				: null].join(" ") }
		>
			<Laced className={ styles.container }>
				{ children }
			</Laced>
		</div>
	);
};
export default AuthenticationLayout;
