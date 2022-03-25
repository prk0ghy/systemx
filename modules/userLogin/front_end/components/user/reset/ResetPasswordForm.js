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
import { useTranslation } from "next-i18next";
const ResetPasswordForm = () => {
	const { t } = useTranslation("common");
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
							initialValues={ {
								email: ""
							} }
							onSubmit={ doResetRequest }
						>
							{
								values => (
									<Form submit="Zurücksetzen" title={ t("passwordReset") }>
										{ currentErrors }
										<Input
											autoComplete="email"
											label={ t("emailAddress") }
											name="email"
											required
											type="email"
											value={ values?.email }
										/>
										<br/>
										<p>{ t("pwReset|enterEmail") }</p>
										<TextLink
											align="right"
											className={ styles.description }
											href={ routes.login.path }
											title={ t("login") }
										>
											{ t("backToLogin") }
										</TextLink>
										<br/>
										<Button
											className={ styles.submit }
											kind="primary"
											type="submit"
										>
											{ t("passwordReset") }
										</Button>
									</Form>
								)
							}
						</Formik>
					)
					: <p>{ t("pwReset|checkEmail") }</p>
				}
			</div>
		</Card>
	);
};
export default ResetPasswordForm;
