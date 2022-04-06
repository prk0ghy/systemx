import { Form, Formik } from "formik";
import {
	useCallback, useEffect, useState
} from "react";
import {
	useRefreshUserData, userPasswordResetCheck, userPasswordResetSubmit
} from "root/api";
import Button from "../../inputs/Button.js";
import Card from "../../generics/Card.js";
import Error from "../../generics/Error.js";
import Input from "../../inputs/Input.js";
import styles from "./ResetPasswordConfirmForm.module.css";
import { useTranslation } from "next-i18next";
const ResetPasswordConfirmForm = props => {
	const { t } = useTranslation("common");
	const [currentErrors, setErrors] = useState("");
	const [showForm, setShowForm] = useState(true);
	const [refresh] = useRefreshUserData();
	const [isValid, setIsValid] = useState(undefined);
	const { token } = props;
	const doResetRequest = useCallback(
		async vals => {
			const res = await userPasswordResetSubmit(token, vals.password);
			if (res.error) {
				setErrors(<Error msg={ res.error }/>);
				setShowForm(false);
			}
			else {
				setShowForm(true);
				refresh();
				if (res.userPasswordResetSubmit) {
					window.location.href = localStorage.getItem("Portal_Session_Token")
						? "/"
						: "/login";
				}
			}
		}, [refresh, token]
	);
	useEffect(() => {
		if (!token) {
			return;
		}
		(async () => {
			const res = await userPasswordResetCheck(token);
			if (res.error) {
				setErrors(<Error msg={ res.error }/>);
				setIsValid(false);
			}
			else {
				setIsValid(res.resetHashFound);
			}
		})();
	}, [token, setIsValid]);
	return (
		<Card>
			<div className={ styles.form }>
				{ isValid
					? (
						<Formik
							initialValues={ {
								password: ""
							} }
							onSubmit={ doResetRequest }
						>
							{	showForm
								? values => (
									<Form submit="resetPassword" title={ t("changePassword") }>
										<h2>{ t("passwordReset") }</h2>
										{ currentErrors }
										<br/>
										<p>{ t("pwReset|enterNew") }</p>
										<Input
											autoComplete="current-password"
											label={ t("password") }
											name="password"
											required
											type="password"
											value={ values?.password }
										/>
										<Button
											className={ styles.submit }
											kind="primary"
											type="submit"
										>
											{ t("pwReset|changePassword") }
										</Button>
									</Form>
								)
								: (
									<>
										<h2>{ t("success") }</h2>
										<br/>
										<p>{ t("pwReset|success") }</p>
									</>
								)
							}
						</Formik>
					)
					: (
						(isValid === false)
							? (
								<>
									<h2>{ t("invalidRequest") }</h2>
									<br/>
									<p>{ t("yourInvalidRequest") }</p>
									{ currentErrors && currentErrors }
								</>
							)
							: <p>{ t("checkingRequest") }</p>
					)
				}
			</div>
		</Card>
	);
};
export default ResetPasswordConfirmForm;
