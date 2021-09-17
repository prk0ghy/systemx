import { Form, Formik } from "formik";
import { useCallback, useRef } from "react";
import { useRefreshUserData, userLogin } from "root/api";
import Button from "../inputs/Button";
import Error from "../generics/Error";
import Input from "components/inputs/Input";
import styles from "./LoginForm.module.css";
const LoginForm = () => {
	const currentErrors = useRef("");
	const [refresh] = useRefreshUserData();
	const doLogin = useCallback(
		async vals => {
			const res = await userLogin(vals.username, vals.password);
			currentErrors.current = res.error
				? <Error msg={ res.error }/>
				: null;
			refresh();
		}, [refresh]
	);
	const initialValues = {
		username: "",
		password: ""
	};
	return (
		<div className={ styles.loginForm }>
			<Formik
				initialValues={ initialValues }
				onSubmit={ doLogin }
			>
				{
					({ values }) => (
						<Form className={ styles.form } submit="Anmelden" title="Anmeldung">
							{ currentErrors.current }
							<Input
								autoComplete="email"
								label="E-Mail"
								name="username"
								required
								type="email"
								value={ values?.username }
							/>
							<Input
								autoComplete="current-password"
								label="Passwort"
								name="password"
								required
								type="password"
								value={ values?.password }
							/>
							<Button className={ styles.submit } kind="primary" type="submit">Login</Button>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default LoginForm;
