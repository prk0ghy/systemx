import AuthenticationLayout from "components/layouts/AuthenticationLayout.mjs";
import LoginForm from "components/forms/LoginForm.mjs";
import Page from "components/shell/Page.mjs";
export default () => (
	<Page title="Anmeldung">
		<AuthenticationLayout>
			<LoginForm/>
		</AuthenticationLayout>
	</Page>
);
