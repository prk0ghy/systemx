import { useCallback, useState } from "react";
import Card from "components/Card.mjs";
import Laced from "components/Laced.mjs";
import LoginForm from "components/LoginForm.mjs";
import Page from "components/Page.mjs";
import RegistrationForm from "components/RegistrationForm.mjs";
import styles from "./Authentication.css";
import { useBrand } from "contexts/Brand.mjs";
export default () => {
	const [isLoginFormShown, setIsLoginFormShown] = useState(true);
	const showRegistration = useCallback(() => {
		setIsLoginFormShown(false);
	}, [
		setIsLoginFormShown
	]);
	const [{ assetBaseURL }] = useBrand();
	return (
		<Page title="Authentifizierung">
			<div className={ styles.authentication }>
				<img className={ styles.image } src={ `${assetBaseURL}/ui/authentication.jpg` }/>
				<Laced className={ styles.container }>
					<Card>
						{
							isLoginFormShown
								? <LoginForm onSwitchView={ showRegistration }/>
								: <RegistrationForm/>
						}
					</Card>
				</Laced>
			</div>
		</Page>
	);
};
