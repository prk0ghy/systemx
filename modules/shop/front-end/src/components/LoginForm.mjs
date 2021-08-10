import { Formik } from "formik";
import AuthenticationForm from "components/AuthenticationForm.mjs";
import Form from "components/Form.mjs";
import Input from "components/Input.mjs";
import styles from "./LoginForm.css";
export default ({
	onSwitchView
}) => (
	<div className={ styles.loginForm }>
		<Formik>
			{
				() => (
					<>
						<AuthenticationForm
							description="Bevor Sie mit Ihrem Einkauf fortfahren können, melden Sie sich bitte an. Dies erleichtert es uns, Ihren Einkauf zu bearbeiten. Falls Sie noch kein Konto haben, haben Sie hier auch die Möglichkeit, ein neues zu registrieren."
							submit="Anmelden"
							title="Anmeldung"
						>
							<button className={ styles.registerButton } onClick={ onSwitchView }>Neues Konto registrieren</button>
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
