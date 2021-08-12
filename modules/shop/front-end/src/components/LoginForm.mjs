import AuthenticationForm from "components/AuthenticationForm.mjs";
import { Formik } from "formik";
import Input from "components/Input.mjs";
import { Link } from "react-router-dom";
import routes from "../routes.mjs";
import styles from "./LoginForm.css";
export default () => {
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
								<Link className={ styles.registrationButton } to={ routes.registration.path }>Neues Konto registrieren</Link>
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
