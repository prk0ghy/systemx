import { Form, Formik } from "formik";
import {
	useCallback, useEffect, useState
} from "react";
import {
	userDeleteCheck, userDeleteSubmit, useRefreshUserData
} from "root/api";
import Button from "../../inputs/Button";
import Card from "../../generics/Card";
import Error from "../../generics/Error";
import styles from "./DeleteUserForm.module.css";
import { useTranslation } from "next-i18next";
const DeleteUserConfirmForm = props => {
	const { t } = useTranslation("common");
	const [currentErrors, setErrors] = useState("");
	const [showForm, setShowForm] = useState(true);
	const [refresh] = useRefreshUserData();
	const [isValid, setIsValid] = useState(undefined);
	const doDeleteRequest = useCallback(
		async () => {
			const res = await userDeleteSubmit(props.token);
			setErrors(res.error
				? <Error msg={ res.error }/>
				: null);
			setShowForm(Boolean(res?.error));
			refresh();
		}, [refresh, props]
	);
	useEffect(() => {
		(async () => {
			setIsValid((await userDeleteCheck(props.token)).deleteHashFound);
		})();
	}, [refresh, props, setIsValid]);
	return (
		<Card>
			<div className={ styles.deleteUserForm }>
				{ isValid
					? (
						<Formik
							initialValues={ {
								email: ""
							} }
							onSubmit={ doDeleteRequest }
						>
							{	showForm
								? (
									<Form submit="deleteUser" title={ t("deleteUser") }>
										<h2>{ t("delUser|final") }</h2>
										{ currentErrors }
										<br/>
										<p>{ t("delUser|click") }</p>
										<Button
											className={ styles.submit }
											kind="primary"
											type="submit"
										>
											{ t("delUser|final") }
										</Button>
									</Form>
								)
								: (
									<>
										<h2>{ t("delUser|deleted") }</h2>
										<br/>
										<p>{ t("delUser|thanks") }</p>
									</>
								)
							}
						</Formik>
					)
					: (
						(isValid === false)
							? (
								<>
									<h2>{ t("invalidRequest") }</h2>
									<br/>
									<p>{ t("yourInvalidRequest") }</p>
								</>
							)
							: <p>{ t("checkingRequest") }</p>
					)
				}
			</div>
		</Card>
	);
};
export default DeleteUserConfirmForm;
