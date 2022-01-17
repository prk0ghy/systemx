import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import Button from "../../inputs/Button";
import Card from "../../generics/Card";
import Error from "../../generics/Error";
import Input from "components/inputs/Input";
import styles from "./DeleteUserForm.module.css";
import { useAuthentication } from "contexts/Authentication";
import { userDeleteRequest } from "root/api";
const DeleteUserForm = () => {
	const [{ user }] = useAuthentication();
	const [currentErrors, setCurrentErrors] = useState("");
	const [requestSent, setRequestSent] = useState(false);
	const doDeleteRequest = useCallback(
		async vals => {
			if (user && (vals.username === user.name)) {
				const res = await userDeleteRequest(vals.username);
				console.log(res);
				setCurrentErrors(res.error
					? <Error msg={ res.error }/>
					: null);
				setRequestSent(!res.error);
			}
			else {
				setCurrentErrors(<><Error msg="Bitte prüfen Sie ihre Eingabe"/><br/></>);
			}
		}, [user, setCurrentErrors, setRequestSent]
	);

	return (
		<Card>
			<div className={ styles.deleteUserForm }>
				{ !requestSent
					? (
						<Formik
							initialValues={ { username: "" } }
							onSubmit={ doDeleteRequest }
						>
							{
								values => (
									<Form submit="deleteUser" title="Benutzer löschen">
										{ currentErrors }
										<Input
											autoComplete="username"
											label="Benuztername"
											name="username"
											required
											type="text"
											value={ values?.username }
										/>
										<br/>
										<p>Um Ihren Benutzer vollst&auml;ndig löschen zu lassen, geben Sie hier bitte zur best&auml;tigung Ihren Benutzernamen ein.</p>
										<Button className={ styles.submit } kind="primary" type="submit">Benutzer löschen</Button>
									</Form>
								)
							}
						</Formik>
					)
					:	<p>Sie sollten jeden Moment eine E-Mail mit einem Best&auml;tigungslink erhalten.</p>
				}
			</div>
		</Card>
	);
};
export default DeleteUserForm;
