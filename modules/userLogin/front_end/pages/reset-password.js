import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import Page from "components/shell/Page";
import ResetPasswordForm from "components/forms/ResetPasswordForm";
const Registration = () => (
	<Page title="Passwort zurücksetzen">
		<AuthenticationLayout>
			<ResetPasswordForm/>
		</AuthenticationLayout>
	</Page>
);
export default Registration;
