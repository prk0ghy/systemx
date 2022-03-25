import dynamic from "next/dynamic";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import Button from "components/inputs/Button";
import CountrySelector from "components/inputs/CountrySelector";
import Input from "components/inputs/Input";
import RadioGroup from "components/inputs/RadioGroup";
import styles from "./InvoiceView.module.css";
import { useInvoice } from "contexts/Invoice";
import { useTranslation } from "next-i18next";
const InvoiceView = ({
	onCancel, onProceed
}) => {
	const { t } = useTranslation("common");
	const [{ invoice }, setInvoice] = useInvoice();
	const accountTypes = {
		personal: t("personalCustomer"),
		business: t("buisnessCustomer")
	};
	const initialValues = {
		accountType: "personal",
		organization: "",
		name: "",
		address: "",
		zip: "",
		city: "",
		country: "",
		...invoice
	};
	const onSubmit = useCallback(data => {
		setInvoice({
			type: "SET_INVOICE",
			data
		});
		onProceed();
	}, [setInvoice, onProceed]);
	const requiredError = t("formValidation|required");
	const validationSchema = Yup.object().shape({
		accountType: Yup.string()
			.required(requiredError),
		organization: Yup.string()
			.when("accountType", {
				is: "business",
				then: Yup.string().required(requiredError)
			}),
		name: Yup.string()
			.required(requiredError),
		address: Yup.string()
			.required(requiredError),
		zip: Yup.string()
			.required(requiredError),
		city: Yup.string()
			.required(requiredError),
		country: Yup.string()
			.length(2)
			.required(t("formValidation|selectCountry"))
	});
	return (
		<div className={ styles.registrationForm }>
			<h4>{ t("invoice|addressRequired") }</h4>
			<br/>
			<Formik
				initialValues={ initialValues }
				onSubmit={ onSubmit }
				validationSchema={ validationSchema }
			>
				{
					({
						submitForm, values
					}) => (
						<Form className={ styles.form } submit="Weiter" title={ t("billingAddress") }>
							<RadioGroup
								label={ t("accountType") }
								name="accountType"
								options={ accountTypes }
								required
							/>
							<br/>
							<Input
								autoComplete="organization"
								disabled={ values.accountType === "personal" }
								label={ t("invoice|organisation") }
								name="organization"
								required
							/>
							<br/>
							<Input
								autoComplete="name"
								label={ t("invoice|name") }
								name="name"
								required
							/>
							<br/>
							<Input
								autoComplete="street-address"
								label={ t("address") }
								name="address"
								required
							/>
							<br/>
							<div className={ styles.postals }>
								<Input
									autoComplete="postal-code"
									className={ styles.zip }
									label={ t("invoice|zipCode") }
									name="zip"
									required
								/>
								<Input
									autoComplete="address-level2"
									className={ styles.city }
									label={ t("invoice|city") }
									name="city"
									required
								/>
								<CountrySelector
									autoComplete="country"
									className={ styles.country }
									label={ t("country") }
									name="country"
									required
								/>
							</div>
							<br/>
							<div className={ styles.actions }>
								<Button className={ styles.cancel } kind="primary" onClick={ onCancel }>
									{ t("invoice|back") }
								</Button>
								<Button className={ styles.proceed } kind="primary" onClick={ submitForm }>
									{ t("invoice|agree") }
								</Button>
							</div>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default dynamic(() => Promise.resolve(InvoiceView), {
	ssr: false
});
