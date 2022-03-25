import { useCallback, useRef } from "react";
import { useRefreshUserData, userLogin } from "root/api";
import Button from "components/inputs/Button";
import Error from "components/generics/Error";
import Form from "components/forms/Form";
import FormActions from "components/forms/FormActions";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import styles from "./LoginForm.module.css";
import routes from "root/routes";
import TextLink from "components/generics/TextLink";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
const LoginForm = ({ loginHref }) => {
	const { t } = useTranslation("common");
	const router = useRouter();
	const currentErrors = useRef("");
	const [refresh] = useRefreshUserData();
	const onSubmit = useCallback(async values => {
		const response = await userLogin(values.username, values.password);
		currentErrors.current = response.error
			? <Error msg={ response.error }/>
			: null;
		refresh();
		if (!response.error && loginHref) {
			router.push(loginHref);
		}
		else if (!response.error && !loginHref) {
			router.push("/");
		}
	}, [loginHref, refresh, router]);
	const initialValues = {
		username: "",
		password: ""
	};
	return (
		<div className={ styles.loginForm }>
			<Formik
				initialValues={ initialValues }
				onSubmit={ onSubmit }
			>
				{
					({ values }) => (
						<Form className={ styles.form } title={ t("Login") }>
							{ currentErrors.current }
							<Input
								autoComplete="email"
								name="username"
								placeholder={ t("emailAddress") }
								required
								type="email"
								value={ values?.username }
							/>
							<div>
								<Input
									autoComplete="current-password"
									name="password"
									placeholder={ t("password") }
									required
									type="password"
									value={ values?.password }
								/>
								<TextLink
									className={ styles.description }
									href={ routes.resetPassword.path }
									title={ t("titles|passwordReset") }
								>
									{ t("forgotPassword") }
								</TextLink>
							</div>
							<FormActions>
								<Button kind="primary" type="submit">{ t("login") }</Button>
							</FormActions>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default LoginForm;
