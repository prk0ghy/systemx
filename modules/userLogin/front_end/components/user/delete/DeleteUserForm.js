import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import Button from "../../inputs/Button";
import Card from "../../generics/Card";
import Error from "../../generics/Error";
import Input from "components/inputs/Input";
import styles from "./DeleteUserForm.module.css";
import { useAuthentication } from "contexts/Authentication";
import { userDeleteRequest } from "root/api";
import { useTranslation } from "next-i18next";
const DeleteUserForm = () => {
	const { t } = useTranslation("common");
	const [{ user }] = useAuthentication();
	const [currentErrors, setCurrentErrors] = useState("");
	const [requestSent, setRequestSent] = useState(false);
	const doDeleteRequest = useCallback(
		async vals => {
			if (user && (vals.username === user.name)) {
				const res = await userDeleteRequest(vals.username);
				console.log(res.error);
				setCurrentErrors(res.error
					? <Error msg={ res.error }/>
					: null);
				setRequestSent(!res.error);
			}
			else {
				setCurrentErrors(<><Error msg={ t("feedback|input|checkInput") }/><br/></>);
			}
		}, [user, setCurrentErrors, setRequestSent, t]
	);
	return (
		<Card>
			<div className={ styles.deleteUserForm }>
				{ !requestSent
					? (
						<Formik
							initialValues={ {
								username: ""
							} }
							onSubmit={ doDeleteRequest }
						>
							{
								values => (
									<Form submit="deleteUser" title={ t("deleteUser") }>
										{ currentErrors }
										<Input
											autoComplete="username"
											label={ t("userName") }
											name="username"
											required
											type="text"
											value={ values?.username }
										/>
										<br/>
										<p>{ t("delUser|prompt") }</p>
										<Button
											className={ styles.submit }
											kind="primary"
											type="submit"
										>
											{ t("deleteUser") }
										</Button>
									</Form>
								)
							}
						</Formik>
					)
					:	<p>{ t("delUser|checkMail") }</p>
				}
			</div>
		</Card>
	);
};
export default DeleteUserForm;
