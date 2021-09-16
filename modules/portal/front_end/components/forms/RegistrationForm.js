import { Form, Formik } from "formik";
import Button from "../inputs/Button";
import CountrySelector from "components/inputs/CountrySelector";
import Input from "components/inputs/Input";
import RadioGroup from "components/inputs/RadioGroup";
import styles from "./RegistrationForm.module.css";
const RegistrationForm = () => {
	const accountTypes = {
		personal: "Privatkunde",
		business: "Geschäftskunde"
	};
	const initialValues = {
		accountType: "personal",
		country: "DE",
		email: "",
		firstName: "",
		lastName: "",
		organization: "",
		password: "",
		passwordRepeated: "",
		postalCode: ""
	};
	return (
		<div className={ styles.registrationForm }>
			<Formik initialValues={ initialValues }>
				{
					({ values }) => (
						<Form className={ styles.form } submit="Registrieren" title="Registrierung">
							<Input
								autoComplete="email"
								label="E-Mail"
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
							<br/>
							<Button className={ styles.submit } kind="primary" type="submit">Registrieren</Button>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default RegistrationForm;
