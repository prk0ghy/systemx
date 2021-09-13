import Button from "../inputs/Button";
import Form from "components/forms/Form";
import { Formik } from "formik";
import Input from "components/inputs/Input";
import styles from "./DeleteUserForm.module.css";
const ResetPasswordForm = () => {
	return (
		<div className={ styles.deleteUserForm }>
			<Formik>
				{
					() => (
						<Form submit="deleteUser" title="Benutzer löschen">
							<Input
								autoComplete="email"
								label="E-Mail"
								name="email"
								required
								type="email"
							/>
							<br/>
							<p>Um Ihren Benutzer löschen zu lassen geben Sie bitte Ihre Email Adresse ein.</p>
							<Button className={ styles.submit } kind="primary" type="submit">Benutzer löschen</Button>
						</Form>
					)
				}
			</Formik>
		</div>
	);
};
export default ResetPasswordForm;
