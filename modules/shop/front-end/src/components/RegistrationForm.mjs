import { Field, Formik } from "formik";
import AuthenticationForm from "components/AuthenticationForm.mjs";
import Button from "components/Button.mjs";
import CountrySelector from "components/CountrySelector.mjs";
import Form from "components/Form.mjs";
import Input from "components/Input.mjs";
import RadioGroup from "components/RadioGroup.mjs";
import styles from "./LoginForm.css";
export default ({
	onSwitchView
}) => {
	const initialValues = {
		accountType: "personal",
		country: "DE",
		firstName: "",
		email: "",
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
					({
						values
					}) => (
						<AuthenticationForm
							description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata."
							submit="Registrieren"
							title="Registrierung"
						>
							<CountrySelector
								autoComplete="country"
								label="Land"
								name="country"
								required
							/>
							<RadioGroup
								label="Kontotyp"
								name="accountType"
								options={{
									personal: "Privatkunde",
									business: "Geschäftskunde"
								}}
								required
							/>
							<Input
								autoComplete="organization"
								disabled={ values.accountType === "personal" }
								label="Organisation"
								name="organization"
								required
							/>
							<Input
								autoComplete="firstName"
								label="Vorname"
								name="firstName"
								required
							/>
							<Input
								autoComplete="lastName"
								label="Nachname"
								name="lastName"
								required
							/>
							<Input
								autoComplete="street-address"
								label="Adresse"
								name="streetAddress"
								required
							/>
							<Input
								autoComplete="postal-code"
								label="Postleitzahl"
								name="postalCode"
								required
							/>
							<Input
								autoComplete="address-level2"
								label="Stadt"
								name="city"
								required
							/>
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
						</AuthenticationForm>
					)
				}
			</Formik>
		</div>
	);
};
