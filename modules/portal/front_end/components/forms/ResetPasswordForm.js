import Button from "../inputs/Button";
import { Form, Formik } from "formik";
import Input from "components/inputs/Input";
import routes from "root/routes";
import styles from "./ResetPasswordForm.module.css";
import TextLink from "components/generics/TextLink";
const ResetPasswordForm = () => {
	return (
		<div className={ styles.registrationForm }>
			<Formik>
				{
					() => (
						<Form submit="Registrieren" title="Passwort zurücksetzen">
							<Input
								autoComplete="email"
								label="E-Mail"
								name="email"
								required
								type="email"
							/>
							<br/>
							<p>Um Ihr Password zurückzusetzen geben Sie bitte Ihre Email Adresse ein.</p>
							<TextLink align="right" className={ styles.description } href={ routes.login.path } title="Anmelden">zurück zum Login</TextLink>
							<Button className={ styles.submit } kind="primary" type="submit">Password zurücksetzen</Button>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default ResetPasswordForm;
