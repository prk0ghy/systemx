import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useRefreshUserData, userPasswordResetCheck, userPasswordResetSubmit } from "root/api";
import Button from "../../inputs/Button.js";
import Card from "../../generics/Card.js";
import Error from "../../generics/Error.js";
import Input from "../../inputs/Input.js";
import styles from "./ResetPasswordConfirmForm.module.css";

const ResetPasswordConfirmForm = props => {
	const [currentErrors, setErrors] = useState("");
	const [showForm, setShowForm] = useState(true);
	const [refresh] = useRefreshUserData();
	const [isValid, setIsValid] = useState(undefined);

	const doResetRequest = useCallback(
		async vals => {
			const res = await userPasswordResetSubmit(props.resetToken, vals.password);
			setErrors(res.error
				? <Error msg={ res.error }/>
				: null);
			setShowForm(Boolean(res?.error));
			refresh();
		}, [refresh, props]
	);

	useEffect(() => {
		(async () => {
			const res = await userPasswordResetCheck(props.resetToken);
			setIsValid(res.resetHashFound);
		})();
	}, [refresh, props, setIsValid]);

	return (
		<Card>
			<div className={ styles.form }>
				{ isValid
					? (
						<Formik
							initialValues={ { password: "" } }
							onSubmit={ doResetRequest }
						>
							{	showForm
								? values => (
									<Form submit="resetPassword" title="Passwort ändern">
										<h2>Passwort zurücksetzen</h2>
										{ currentErrors }
										<br/>
										<p>Bitte geben Sie ein neues Passwort ein:</p>
										<Input
											autoComplete="current-password"
											label="Passwort"
											name="password"
											required
											type="password"
											value={ values?.password }
										/>
										<Button className={ styles.submit } kind="primary" type="submit">Passwort ändern</Button>
									</Form>
								)
								: (
									<>
										<h2>Erfolg</h2>
										<br/>
										<p>Ihr passwort wurde erfolgreiche geändert.</p>
									</>
								)
							}
						</Formik>
					)
					: (
						(isValid === false)
							? (
								<>
									<h2>Ungültige Anfrage</h2>
									<br/>
									<p>ihre Anfrage ist ungültig.</p>
								</>
							)
							: <p>Prüfen der Anfrage</p>
					)
				}
			</div>
		</Card>
	);
};
export default ResetPasswordConfirmForm;
