import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import Button from "../../inputs/Button";
import Card from "../../generics/Card.js";
import Error from "../../generics/Error.js";
import Input from "../../inputs/Input.js";
import routes from "root/routes";
import styles from "./ResetPasswordForm.module.css";
import TextLink from "../../generics/TextLink.js";
import { userPasswordResetRequest } from "root/api";

const ResetPasswordForm = () => {
	const [currentErrors, setCurrentErrors] = useState("");
	const [requestSent, setRequestSent] = useState(false);
	const doResetRequest = useCallback(
		async vals => {
			const res = await userPasswordResetRequest(vals.email);
			setCurrentErrors(res.error
				? <Error msg={ res.error }/>
				: null);
			setRequestSent(!res.error);
		}, [setCurrentErrors, setRequestSent]
	);

	return (
		<Card>
			<div className={ styles.registrationForm }>
				{ !requestSent
					? (
						<Formik
							initialValues={ { email: "" } }
							onSubmit={ doResetRequest }
						>
							{
								values => (
									<Form submit="Zurücksetzen" title="Passwort zurücksetzen">
										{ currentErrors }
										<Input
											autoComplete="email"
											label="E-Mail"
											name="email"
											required
											type="email"
											value={ values?.email }
										/>
										<br/>
										<p>Um Ihr Password zurückzusetzen geben Sie bitte Ihre Email Adresse ein.</p>
										<TextLink align="right" className={ styles.description } href={ routes.login.path } title="Anmelden">zurück zum Login</TextLink>
										<br/>
										<Button className={ styles.submit } kind="primary" type="submit">Password zurücksetzen</Button>
									</Form>
								)
							}
						</Formik>
					)
					: <p>Wir haben Ihnen eine E-Mail mit einem bestätigungslink gesendet, bitte prüfen Sie auch in Ihrem Spam Ordner.</p>
				}
			</div>
		</Card>
	);
};
export default ResetPasswordForm;
