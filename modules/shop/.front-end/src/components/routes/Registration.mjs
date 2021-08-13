import AuthenticationLayout from "components/layouts/AuthenticationLayout.mjs";
import Page from "components/shell/Page.mjs";
import RegistrationForm from "components/forms/RegistrationForm.mjs";
export default () => (
	<Page title="Registrierung">
		<AuthenticationLayout>
			<RegistrationForm/>
		</AuthenticationLayout>
	</Page>
);
