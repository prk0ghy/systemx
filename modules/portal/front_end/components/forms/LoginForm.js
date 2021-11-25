import { useCallback, useRef } from "react";
import { useRefreshUserData, userLogin } from "root/api";
import Button from "../inputs/Button";
import Error from "../generics/Error";
import Form from "components/forms/Form";
import FormActions from "components/forms/FormActions";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import routes from "root/routes";
import styles from "./LoginForm.module.css";
import TextLink from "components/generics/TextLink";
import { useRouter } from "next/router";

const LoginForm = () => {
	const router = useRouter();
	const currentErrors = useRef("");
	const [refresh] = useRefreshUserData();
	const onSubmit = useCallback(async values => {
		const response = await userLogin(values.username, values.password);
		currentErrors.current = response.error
			? <Error msg={ response.error }/>
			: null;
		refresh();
		if(!response.error){
			router.push(`/`); // A little overview page would be nice, for now the start page has to be enough
		}
	}, [
		refresh,
		router
	]);
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
						<Form className={ styles.form } title="Anmeldung">
							{ currentErrors.current }
							<Input
								autoComplete="email"
								label="E-Mail-Adresse"
								name="username"
								required
								type="email"
								value={ values?.username }
							/>
							<div>
								<Input
									autoComplete="current-password"
									label="Passwort"
									name="password"
									required
									type="password"
									value={ values?.password }
								/>
								<TextLink align="right" className={ styles.description } href={ routes.resetPassword.path } title="Passwort zurücksetzen">Passwort vergessen?</TextLink>
							</div>
							<FormActions>
								<Button kind="primary" type="submit">Anmelden</Button>
							</FormActions>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default LoginForm;
