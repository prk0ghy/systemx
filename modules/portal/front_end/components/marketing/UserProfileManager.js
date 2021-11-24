import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useRefreshUserData, userMetaSet } from "../../api.js";
import Button from "../inputs/Button.js";
import UserCountryEdit from "../inputs/userMeta/UserCountryEdit.js";
import ButtonLink from "../inputs/ButtonLink.js";
import EditIcon from "@mui/icons-material/Edit";
import RadioGroup from "components/inputs/RadioGroup";
import styles from "./UserProfileManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserProfile from "./Userprofile.js";

const UserProfileManager = () => {
	const [{ user }] = useAuthentication();
	const [refresh] = useRefreshUserData();
	const [business, setBusiness] = useState(false);
	const ToggleBusiness = useCallback(
		() => {
			setBusiness(value => !value);
			refresh();
		}, [refresh]
	);
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

	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
						<h4>Ihr Benutzerprofil</h4>
						<br/>
						<div className={ styles.grid }>
							<div className={ styles.left }>
								<UserProfile/>
							</div>
							<div className={ styles.right }>
								<p><a><EditIcon className={ styles.edit }/></a></p>
								<p><a><EditIcon className={ styles.edit }/></a></p>
								<UserCountryEdit/>
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
						<br/>
						<ButtonLink href="/reset-password">Passwort zurücksetzen</ButtonLink>
						<br/>
						<br/>
						<ButtonLink href="/delete-user">Benutzer löschen</ButtonLink>
						<br/>
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfileManager;
