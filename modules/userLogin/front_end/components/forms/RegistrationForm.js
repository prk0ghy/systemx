import { object, string } from "yup";
import { useRefreshUserData, userRegister } from "root/api";
import Button from "../inputs/Button";
import CountrySelector from "components/inputs/CountrySelector";
import Form from "components/forms/Form";
import FormActions from "components/forms/FormActions";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import RadioGroup from "components/inputs/RadioGroup";
import styles from "./RegistrationForm.module.css";
import { useCallback } from "react";
const RegistrationForm = () => {
	const [refresh] = useRefreshUserData();
	const onSubmit = useCallback(async values => {
		const response = await userRegister(values.username, values.email, values.password, values);
		console.log(response);
		refresh();
	}, [
		refresh
	]);
	const accountTypes = {
		personal: "Privatkunde",
		business: "Geschäftskunde"
	};
	const initialValues = {
		accountType: "personal",
		country: "DE",
		email: "",
		organization: "",
		password: "",
		passwordRepeated: ""
	};
	const requiredError = "Dies ist ein Pflichtfeld.";
	const validationSchema = object().shape({
		accountType: string()
			.required(requiredError),
		country: string()
			.required(requiredError),
		email: string()
			.email("Diese E-Mail-Adresse is ungültig.")
			.required(requiredError),
		organization:
			string(),
		password: string()
			.required(requiredError),
		passwordRepeated: string()
			.required(requiredError)
	});
	return (
		<div className={ styles.registrationForm }>
			<Formik
				initialValues={ initialValues }
				onSubmit={ onSubmit }
				validationSchema={ validationSchema }
			>
				{
					({ values }) => (
						<Form className={ styles.form } title="Registrierung">
							<Input
								autoComplete="email"
								label="E-Mail-Adresse"
								name="email"
								required
								type="email"
							/>
							<Input
								autoComplete="new-password"
								label="Passwort"
								name="password"
								required
								type="password"
							/>
							<Input
								autoComplete="new-password"
								label="Passwort wiederholen"
								name="passwordRepeated"
								required
								type="password"
							/>
							<RadioGroup
								label="Kontotyp"
								name="accountType"
								options={ accountTypes }
								required
							/>
							<Input
								autoComplete="organization"
								disabled={ values.accountType === "personal" }
								label="Organisation"
								name="organization"
								required
							/>
							<CountrySelector
								autoComplete="country"
								label="Land"
								name="country"
								required
							/>
							<FormActions>
								<Button className={ styles.submit } kind="primary" type="submit">Registrieren</Button>
							</FormActions>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default RegistrationForm;
