import { Form, Formik } from "formik";
import { useCallback, useRef } from "react";
import { userDeleteSubmit, useRefreshUserData } from "root/api";
import Button from "../inputs/Button";
import Error from "../generics/Error";
import styles from "./DeleteUserForm.module.css";

const DeleteUserConfirmForm = props => {
	const currentErrors = useRef("");
	const requestSent = useRef(false);
	const [refresh] = useRefreshUserData();

	const doDeleteRequest = useCallback(
		async () => {
			const res = await userDeleteSubmit(props.deletionToken);
			currentErrors.current = res.error
				? <Error msg={ res.error }/>
				: null;
			refresh();
			requestSent.current = Boolean(res.error);
		}, [refresh, props]
	);

	return (
		<div className={ styles.deleteUserForm }>
			<Formik
				initialValues={ { email: "" } }
				onSubmit={ doDeleteRequest }
			>
				{
					() => (
						<Form submit="deleteUser" title="Benutzer löschen">
							<h2>Konto endg&uuml;tig l&ouml;schen</h2>
							{ currentErrors.current }
							<br/>
							<p>Klicken Sie auf den folgenden Button um all ihre Daten zu loeschen.</p>
							<Button className={ styles.submit } kind="primary" type="submit">Benutzer endguetig löschen</Button>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default DeleteUserConfirmForm;
