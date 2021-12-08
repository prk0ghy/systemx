import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useRefreshUserData, userMetaSet } from "../../../api.js";
import Button from "../../inputs/Button.js";
import CountrySelector from "components/inputs/CountrySelector";
import EditIcon from "@mui/icons-material/Edit";
import LeftRightGroup from "../../generics/LeftRightGroup.js";
import styles from "./UserCountryEdit.module.css";
import { useAuthentication } from "contexts/Authentication";
const UserCountryEdit = () => {
	const [{ user }] = useAuthentication();
	const [refresh] = useRefreshUserData();
	const [modal, setModal] = useState(false);
	const ToggleModal = useCallback(
		() => {
			setModal(modal => !modal);
			refresh();
		}, [refresh]
	);
	const setUserMetaCountry = useCallback(
		async vals => {
			await userMetaSet("country", vals.country);
			refresh();
			setModal(false);
		}, [refresh]
	);
	const initialValues = {
		country: user.meta.country
	};
	return (
		<>
			<p><a onClick={ ToggleModal }><EditIcon className={ styles.edit }/></a></p>
			{ modal
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
										<br/>
										<LeftRightGroup>
											<Button className={ styles.submit } kind="primary" type="submit">OK</Button>
											<Button className={ styles.cancel } kind="secondary" onClick={ ToggleModal }>Abbrechen</Button>
										</LeftRightGroup>
									</Form>
								)
							}
						</Formik>
					</div>
				)
				: (
					null
				)
			}
		</>
	);
};
export default UserCountryEdit;
