import { Form, Formik } from "formik";
import { memo, useCallback, useState } from "react";
import { useRefreshUserData, userMetaSet } from "../../api.js";
import Button from "../inputs/Button.js";
import ButtonLink from "../inputs/ButtonLink.js";
import CountrySelector from "components/inputs/CountrySelector";
import EditIcon from "@mui/icons-material/Edit";
import { H } from "root/format";
import RadioGroup from "components/inputs/RadioGroup";
import styles from "./UserProfileManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserProfile from "./Userprofile.js";

const UserProfileManager = () => {
	const [{ user }] = useAuthentication();
	const [options, setOptions] = useState(false);
	const [refresh] = useRefreshUserData();
	const isProfile = (window.location.pathname === "/login")
		? "Benutzeroptionen"
		: "zum Benutzerprofil";
	const ToggleOptions = () => {
		if (window.location.pathname === "/login") {
			setOptions(value => !value);
			setBusiness(false);
		}
		else {
			window.location.pathname = "/login";
		}
	};
	const OptionButton = () => {
		return (
			<ButtonLink className={ styles.button } onClick={ ToggleOptions }>{ isProfile }</ButtonLink>
		);
	};
	const [country, setCountry] = useState(false);
	const [business, setBusiness] = useState(false);
	const ToggleCountry = () => {
		setCountry(value => !value);
	};
	const ToggleBusiness = () => {
		setBusiness(value => !value);
	};
	const accountTypes = {
		personal: "Privatkunde",
		business: "Geschäftskunde"
	};
	const initialValues = {
		username: user.name,
		useremail: user.email
	};

	const setUserMetaBusiness = useCallback(
		async vals => {
			let businessStatus = false;
			if (vals.accountType === "business") {
				businessStatus = true;
			}
			await userMetaSet("isBusinessCustomer", businessStatus);
			refresh();
			setBusiness(false);
		}, [refresh]
	);
	const setUserMetaCountry = useCallback(
		async vals => {
			await userMetaSet("country", vals.country);
			refresh();
			setCountry(false);
		}, [refresh]
	);

	console.log(JSON.stringify(user, null, 4));
	return (
		<>
			{ user
				? options
					? (
						<section className={ styles.userProfile }>
							<h4>Benutzeroptionen</h4>
							<br/>
							<div className={ styles.grid }>
								<div className={ styles.left }>
									<UserProfile/>
								</div>
								<div className={ styles.right }>
									<p><a><EditIcon className={ styles.edit }/></a></p>
									<p><a><EditIcon className={ styles.edit }/></a></p>
									{ country
										? (
											<div className={ styles.countryForm }>
												<Formik
													initialValues={ initialValues }
													onSubmit={ setUserMetaCountry }
												>
													{
														() => (
															<Form className={ styles.form } submit="ändern" title="ändern">
																<CountrySelector
																	autoComplete="country"
																	label="Land"
																	name="country"
																	required
																/>
																<Button className={ styles.submit } kind="primary" type="submit">OK</Button>
																<a onClick={ ToggleCountry }>Abbrechen</a>
															</Form>
														)
													}
												</Formik>
											</div>
										)
										: (
											<p><a onClick={ ToggleCountry }><EditIcon className={ styles.edit }/></a></p>
										)
									}
									{ business
										? (
											<div className={ styles.businessForm }>
												<Formik
													initialValues={ initialValues }
													onSubmit={ setUserMetaBusiness }
												>
													{
														() => (
															<Form className={ styles.form } submit="ändern" title="ändern">
																<RadioGroup
																	label="Kontotyp"
																	name="accountType"
																	options={ accountTypes }
																	required
																/>
																<Button className={ styles.submit } kind="primary" type="submit">OK</Button>
																<a onClick={ ToggleBusiness }>Abbrechen</a>
															</Form>
														)
													}
												</Formik>
											</div>
										)
										: (
											<p><a onClick={ ToggleBusiness }><EditIcon className={ styles.edit }/></a></p>
										)
									}
								</div>
							</div>
							<a className={ styles.link } href="/reset-password">Passwort zurücksetzen</a>
							<br/>
							<a className={ styles.link } href="/delete-user">Benutzer löschen</a>
							<br/>
							<br/>
							<ButtonLink className={ styles.button } onClick={ ToggleOptions }>zurück</ButtonLink>
						</section>
					)
					: (
						<section className={ styles.userProfile }>
							<h4><H>Benutzerprofil</H></h4>
							<br/>
							<UserProfile/>
							<OptionButton/>
						</section>
					)
				: null
			}
		</>
	);
};
export default UserProfileManager;
