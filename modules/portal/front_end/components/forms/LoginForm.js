import API from "root/api";
import Button from "../inputs/Button";
import Form from "components/forms/Form";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import styles from "./LoginForm.module.css";
import { useCallback } from "react";
const LoginForm = () => {
	return (
		<div className={ styles.loginForm }>
			<Formik>
				<Form submit="Anmelden" title="Anmeldung">
					<Input
						autoComplete="email"
						label="E-Mail"
						required
						type="email"
					/>
					<Input
						autoComplete="current-password"
						label="Passwort"
						required
						type="password"
					/>
					<Button className={ styles.submit } kind="primary" type="submit">Login</Button>
				</Form>
			</Formik>
		</div>
	);
};
export default LoginForm;
