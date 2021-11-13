import { Form, Formik } from "formik";
import { useCallback, useRef } from "react";
import { userDeleteRequest, useRefreshUserData } from "root/api";
import Button from "../inputs/Button";
import Error from "../generics/Error";
import Input from "components/inputs/Input";
import styles from "./DeleteUserForm.module.css";
const DeleteUserForm = () => {
	const currentErrors = useRef("");
	const requestSent = useRef(false);
	const [refresh] = useRefreshUserData();
	const doDeleteRequest = useCallback(
		async vals => {
			const res = await userDeleteRequest(vals.email);
			currentErrors.current = res.error
				? <Error msg={ res.error }/>
				: null;
			refresh();
			requestSent.current = Boolean(res.error);
		}, [refresh]
	);

	return (
		<div className={ styles.deleteUserForm }>
			{ requestSent
				? (
					<Formik
						initialValues={ { email: "" } }
						onSubmit={ doDeleteRequest }
					>
						{
							values => (
								<Form submit="deleteUser" title="Benutzer löschen">
									{ currentErrors.current }
									<Input
										autoComplete="email"
										label="E-Mail"
										name="email"
										required
										type="email"
										value={ values?.email }
									/>
									<br/>
									<p>Um Ihren Benutzer vollst&auml;ndig löschen zu lassen, geben Sie hier bitte zur est&auml;tigung Ihre Email Adresse ein.</p>
									<Button className={ styles.submit } kind="primary" type="submit">Benutzer löschen</Button>
								</Form>
							)
						}
					</Formik>
				)
				:	<p>Sie sollten jeden Moment eine E-Mail mit einem Best&aumltigungslink erhalten.</p>
			}
		</div>
	);
};
export default DeleteUserForm;
