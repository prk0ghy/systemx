import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useRefreshUserData, userMetaSet } from "../../../api.js";
import Button from "../../inputs/Button.js";
import EditIcon from "@mui/icons-material/Edit";
import LeftRightGroup from "../../generics/LeftRightGroup.js";
import RadioGroup from "../../inputs/RadioGroup.js";
import styles from "./UserBusinessEdit.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useTranslation } from "next-i18next";
const UserBusinessEdit = () => {
	const { t } = useTranslation("common");
	const [{ user }] = useAuthentication();
	const [refresh] = useRefreshUserData();
	const [modal, setModal] = useState(false);
	const ToggleModal = useCallback(
		() => {
			setModal(modal => !modal);
			refresh();
		}, [refresh]
	);
	const accountTypes = {
		personal: t("personalCustomer"),
		business: t("buisnessCustomer")
	};
	const setUserMetaBusiness = useCallback(
		async vals => {
			let businessStatus = false;
			if (vals.accountType === "business") {
				businessStatus = true;
			}
			await userMetaSet("isBusinessCustomer", businessStatus);
			refresh();
			setModal(false);
		}, [refresh]
	);
	const initialValues = {
		accountType: user?.meta?.isBusinessCustomer
			? "business"
			: "personal"
	};
	return (
		<>
			<p><a onClick={ ToggleModal }><EditIcon className={ styles.edit }/></a></p>
			{ modal
				? (
					<div className={ styles.businessForm }>
						<Formik
							initialValues={ initialValues }
							onSubmit={ setUserMetaBusiness }
						>
							{
								() => (
									<Form className={ styles.form } submit="ändern" title={ t("changeAccountType") }>
										<RadioGroup
											label={ t("accountType") }
											name="accountType"
											options={ accountTypes }
											required
										/>
										<br/>
										<LeftRightGroup>
											<Button
												className={ styles.submit }
												kind="primary"
												type="submit"
											>
												{ t("ok") }
											</Button>
											<Button
												className={ styles.cancel }
												kind="secondary"
												onClick={ ToggleModal }
											>
												{ t("abort") }
											</Button>
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
export default UserBusinessEdit;
