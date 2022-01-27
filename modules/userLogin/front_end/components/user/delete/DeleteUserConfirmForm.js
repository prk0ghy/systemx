import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { userDeleteCheck, userDeleteSubmit, useRefreshUserData } from "root/api";
import Button from "../../inputs/Button";
import Card from "../../generics/Card";
import Error from "../../generics/Error";
import styles from "./DeleteUserForm.module.css";

const DeleteUserConfirmForm = props => {
	const [currentErrors, setErrors] = useState("");
	const [showForm, setShowForm] = useState(true);
	const [refresh] = useRefreshUserData();
	const [isValid, setIsValid] = useState(undefined);

	const doDeleteRequest = useCallback(
		async () => {
			const res = await userDeleteSubmit(props.deletionToken);
			setErrors(res.error
				? <Error msg={ res.error }/>
				: null);
			setShowForm(Boolean(res?.error));
			refresh();
		}, [refresh, props]
	);

	useEffect(() => {
		(async () => {
			setIsValid((await userDeleteCheck(props.deletionToken)).deleteHashFound);
		})();
	}, [refresh, props, setIsValid]);

	return (
		<Card>
			<div className={ styles.deleteUserForm }>
				{ isValid
					? (
						<Formik
							initialValues={ { email: "" } }
							onSubmit={ doDeleteRequest }
						>
							{	showForm
								? (
									<Form submit="deleteUser" title="Benutzer löschen">
										<h2>Konto endg&uuml;ltig l&ouml;schen</h2>
										{ currentErrors }
										<br/>
										<p>Klicken Sie auf den folgenden Button um all ihre Daten zu loeschen.</p>
										<Button className={ styles.submit } kind="primary" type="submit">Benutzer endguetig löschen</Button>
									</Form>
								)
								: (
									<>
										<h2>Konto endg&uuml;tig gel&ouml;scht</h2>
										<br/>
										<p>Vielen Dank, f&uuml;r ihr Vertrauen.</p>
									</>
								)
							}
						</Formik>
					)
					: (
						(isValid === false)
							? (
								<>
									<h2>Ungültige Anfrage</h2>
									<br/>
									<p>ihre Anfrage ist ungültig.</p>
								</>
							)
							: <p>Prüfen der Anfrage</p>
					)
				}
			</div>
		</Card>
	);
};
export default DeleteUserConfirmForm;
