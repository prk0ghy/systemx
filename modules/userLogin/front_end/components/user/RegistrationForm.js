import dynamic from "next/dynamic";
import * as Yup from "yup";
import { userRegister } from "root/api";
import Button from "components/inputs/Button";
import Error from "components/generics/Error";
import Form from "components/forms/Form";
import FormActions from "components/forms/FormActions";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import styles from "./RegistrationForm.module.css";
import {
	useCallback, useRef, useState
} from "react";
import RadioGroup from "../inputs/RadioGroup.js";
import CountrySelector from "../inputs/CountrySelector.js";
import ActivationNotice from "./activate/ActivationNotice.js";
import { useTranslation } from "next-i18next";
const RegistrationForm = () => {
	const { t } = useTranslation("common");
	const [userEmail, setUserEmail] = useState("");
	const [requiresCountry, setRequiresCountry] = useState(false);
	const [sentActivation, setSentActivation] = useState(false);
	const currentErrors = useRef("");
	const onSubmit = useCallback(async values => {
		const meta = {
			...(requiresCountry && {
				isBuisnessCustomer: true
			}),
			...(requiresCountry && {
				country: values.country
			})
		};
		const response = await userRegister(values.email, values.email, values.password, meta);
		currentErrors.current = response.error
			? <Error msg={ response.error }/>
			: null;
		setSentActivation(!response.error);
		setUserEmail(values.email);
	}, [requiresCountry]);
	const accountTypes = {
		personal: t("personalCustomer"),
		buisness: t("buisnessCustomer")
	};
	const initialValues = {
		email: "",
		password: "",
		passwordRepeated: "",
		accountType: "personal",
		country: "DE"
	};
	const requiredError = "Dies ist ein Pflichtfeld.";
	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email(t("formValidation|invalidEmail"))
			.required(requiredError),
		password: Yup.string()
			.required(requiredError)
			.min(8, t("formValidation|passwordLength")),
		passwordRepeated: Yup.string()
			.required(requiredError)
			.oneOf([Yup.ref("password")], t("formValidation|passwordMismatch")),
		accountType: Yup.string()
			// .required(requiredError)
			.oneOf(["personal", "buisness"]),
		country: Yup.string()
			.when("accountType", {
				is: "buisness",
				then: Yup.string().required(requiredError)
			})
	});
	/**
	 * Hijack validation for onChange handling
	 *
	 * @param {Object} values
	 * @param {string} values.email
	 * @param {string} values.password
	 * @param {string} values.passwordRepeated
	 * @param {"personal" | "buisness"} values.accountType
	 * @param {string} values.country
	 */
	const validateForm = useCallback(async values => {
		setRequiresCountry(values.accountType === "buisness");
		// Catch validation errors so next doesnt throw warnings
		try {
			await validationSchema.validate(values);
		}
		catch (error) {
			return error;
		}
		return {};
	}, [validationSchema]);
	return (
		<div className={ styles.registrationForm }>
			{
				sentActivation
					? (
						<ActivationNotice email={ userEmail }/>
					)
					: (
						<Formik
							initialValues={ initialValues }
							onSubmit={ onSubmit }
							validate={ validateForm }
						>
							{
								() => (
									<Form className={ styles.form } title={ t("titles|registration") }>
										{ currentErrors.current }
										<Input
											autoComplete="email"
											label={ t("emailAddress") }
											name="email"
											required
											type="email"
										/>
										<Input
											autoComplete="new-password"
											label={ t("password") }
											name="password"
											required
											type="password"
										/>
										<Input
											autoComplete="new-password"
											label={ t("passwordRepeat") }
											name="passwordRepeated"
											required
											type="password"
										/>
										<RadioGroup
											label={ t("accountType") }
											name="accountType"
											options={ accountTypes }
											required
											type="radio"
										/>
										{
											requiresCountry && (
												<CountrySelector
													autoComplete="country"
													label={ t("country") }
													name="country"
													required
												/>
											)
										}
										<FormActions>
											<Button className={ styles.submit } kind="primary" type="submit">{ t("register") }</Button>
										</FormActions>
									</Form>
								)
							}
						</Formik>
					)
			}
		</div>
	);
};
export default dynamic(() => Promise.resolve(RegistrationForm), {
	ssr: false
});
