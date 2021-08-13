import AuthenticationForm from "components/forms/AuthenticationForm";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import Link from "next/link";
import routes from "root/routes";
import styles from "./LoginForm.module.css";
const LoginForm = () => {
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
								<Link href={ routes.registration.path }>
									<a className={ styles.registrationButton }>Neues Konto registrieren</a>
								</Link>
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
export default LoginForm;
