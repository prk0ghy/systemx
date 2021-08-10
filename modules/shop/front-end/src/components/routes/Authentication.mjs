import { useCallback, useState } from "react";
import Laced from "components/Laced.mjs";
import LoginForm from "components/LoginForm.mjs";
import RegistrationForm from "components/RegistrationForm.mjs";
import Page from "components/Page.mjs";
import styles from "./Authentication.css";
export default () => {
	const [isLoginFormShown, setIsLoginFormShown] = useState(true);
	const showRegistration = useCallback(() => {
		setIsLoginFormShown(false);
	}, [
		setIsLoginFormShown
	]);
	return (
		<Page title="Authentifizierung">
			<div className={ styles.authentication }>
				<img className={ styles.image } src="/assets/mvet/ui/authentication.jpg"/>
				<Laced className={ styles.container }>
					{
						isLoginFormShown
							? <LoginForm onSwitchView={ showRegistration }/>
							: <RegistrationForm/>
					}
				</Laced>
			</div>
		</Page>
	);
};
