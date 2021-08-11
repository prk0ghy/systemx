import AuthenticationForm from "components/AuthenticationForm.mjs";
import { Formik } from "formik";
import Input from "components/Input.mjs";
import styles from "./LoginForm.css";
export default ({ onSwitchView }) => {
	const description = (
		<>
			<p>Bevor Sie mit Ihrem Einkauf fortfahren können, melden Sie sich bitte an. Dies erleichtert es uns, Ihren Einkauf zu bearbeiten.</p>
			<p>Falls Sie noch kein Konto haben, haben Sie hier auch die Möglichkeit, ein neues zu registrieren.</p>
		</>
	);
	return (
		<div className={ styles.loginForm }>
			<Formik>
				{
					() => (
						<>
							<AuthenticationForm
								description={ description }
								submit="Anmelden"
								title="Anmeldung"
							>
								<button className={ styles.registerButton } onClick={ onSwitchView } type="button">Neues Konto registrieren</button>
								<Input
									autoComplete="email"
									label="E-Mail-Adresse"
									required
									type="email"
								/>
								<Input
									autoComplete="current-password"
									label="Passwort"
									required
									type="password"
								/>
							</AuthenticationForm>
						</>
					)
				}
			</Formik>
		</div>
	);
};
